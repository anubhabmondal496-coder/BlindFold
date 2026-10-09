import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tts/flutter_tts.dart';

class VoiceService {
  static final VoiceService instance = VoiceService._internal();
  VoiceService._internal();

  FlutterTts? _flutterTts;
  bool _isInitialized = false;
  bool _isSpeaking = false;
  bool _muted = false;

  bool get isSpeaking => _isSpeaking;
  bool get isMuted => _muted;

  Future<void> init() async {
    if (_isInitialized) return;
    try {
      _flutterTts = FlutterTts();
      
      await _flutterTts?.setLanguage("en-US");
      await _flutterTts?.setSpeechRate(0.52); // Clear and intelligible pace for screen reader
      await _flutterTts?.setVolume(1.0);
      await _flutterTts?.setPitch(1.0);

      _flutterTts?.setStartHandler(() {
        _isSpeaking = true;
      });

      _flutterTts?.setCompletionHandler(() {
        _isSpeaking = false;
      });

      _flutterTts?.setErrorHandler((msg) {
        _isSpeaking = false;
        debugPrint("[VoiceService Error]: $msg");
      });

      _isInitialized = true;
    } catch (e) {
      debugPrint("[VoiceService Init Exception]: $e");
    }
  }

  Future<void> speak(String message, {bool interrupt = true}) async {
    if (_muted || message.trim().isEmpty) return;

    // Provide haptic feedback so the user feels the confirmation instantly
    HapticFeedback.lightImpact();

    if (!_isInitialized) {
      await init();
    }

    try {
      if (interrupt) {
        await _flutterTts?.stop();
      }
      await _flutterTts?.speak(message);
    } catch (e) {
      debugPrint("[VoiceService Speak Exception]: $e");
    }
  }

  Future<void> stop() async {
    try {
      await _flutterTts?.stop();
      _isSpeaking = false;
    } catch (e) {
      debugPrint("[VoiceService Stop Exception]: $e");
    }
  }

  void toggleMute() {
    _muted = !_muted;
    if (_muted) {
      stop();
    }
  }
}
