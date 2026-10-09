import 'package:flutter/material.dart';
import '../models/obstacle_detection.dart';
import '../services/voice_service.dart';
import '../theme/app_theme.dart';
import 'walking_radar_screen.dart';
import 'currency_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final List<ObstacleDetection> _obstacles = ObstacleDetection.defaultObstacles;
  int _activeObstacleIndex = 0;
  bool _isVoiceAssistantListening = false;

  ObstacleDetection get _currentObstacle => _obstacles[_activeObstacleIndex];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      VoiceService.instance.speak(
        "BlindFold activated. Tap anywhere on the center card to hear obstacle status, or use the voice assistant button below.",
      );
    });
  }

  // Speaks out the current path status
  void _announceCurrentStatus() {
    final statusPhrase =
        "${_currentObstacle.title} detected. Distance: ${_currentObstacle.distanceFormatted}, ${_currentObstacle.stepsFormatted}, ${_currentObstacle.zoneLabel}. ${_currentObstacle.advice}";
    VoiceService.instance.speak(statusPhrase);
  }

  void _cycleObstacle() {
    setState(() {
      _activeObstacleIndex = (_activeObstacleIndex + 1) % _obstacles.length;
    });
    VoiceService.instance.speak(_currentObstacle.spokenText);
  }

  // Pre-wired Hook for the Voice Assistant Button
  // Ready to receive and execute the user's custom voice button logic!
  void _handleVoiceAssistantPressed() {
    setState(() {
      _isVoiceAssistantListening = !_isVoiceAssistantListening;
    });

    if (_isVoiceAssistantListening) {
      VoiceService.instance.speak("Voice Assistant listening. Ready for your command.");
    } else {
      VoiceService.instance.speak("Voice Assistant paused.");
    }
  }

  Color _getUrgencyColor(ObstacleUrgency urgency) {
    switch (urgency) {
      case ObstacleUrgency.critical:
        return AppTheme.alertCritical;
      case ObstacleUrgency.warning:
        return AppTheme.accentAmber;
      case ObstacleUrgency.caution:
        return AppTheme.accentBlue;
      case ObstacleUrgency.info:
        return AppTheme.alertSafe;
    }
  }

  @override
  Widget build(BuildContext context) {
    final urgencyColor = _getUrgencyColor(_currentObstacle.urgency);

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top Minimalist Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppTheme.accentAmber, width: 2),
                        ),
                        clipBehavior: Clip.antiAlias,
                        child: Image.asset(
                          'assets/logo.png',
                          fit: BoxFit.contain,
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "BLINDFOLD",
                            style: TextStyle(
                              color: AppTheme.textPrimary,
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1.5,
                            ),
                          ),
                          Text(
                            "YOUR WORLD, YOUR WAY",
                            style: TextStyle(
                              color: AppTheme.accentAmber,
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Semantics(
                    label: VoiceService.instance.isMuted ? "Unmute Voice" : "Mute Voice",
                    button: true,
                    child: IconButton(
                      iconSize: 34,
                      style: IconButton.styleFrom(
                        backgroundColor: AppTheme.cardBackground,
                        side: const BorderSide(color: AppTheme.cardBorder, width: 2),
                      ),
                      icon: Icon(
                        VoiceService.instance.isMuted ? Icons.volume_off : Icons.volume_up,
                        color: VoiceService.instance.isMuted
                            ? AppTheme.textSecondary
                            : AppTheme.accentAmber,
                      ),
                      onPressed: () {
                        setState(() {
                          VoiceService.instance.toggleMute();
                        });
                        if (!VoiceService.instance.isMuted) {
                          VoiceService.instance.speak("Audio unmuted.");
                        }
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Live Obstacle Radar Banner
              Semantics(
                label: "Nearest obstacle: ${_currentObstacle.title}, ${_currentObstacle.distanceFormatted}, ${_currentObstacle.stepsFormatted}, ${_currentObstacle.zoneLabel}",
                button: true,
                child: Material(
                  color: AppTheme.cardBackground,
                  borderRadius: BorderRadius.circular(16),
                  child: InkWell(
                    onTap: _cycleObstacle,
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: urgencyColor, width: 2.5),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.radar, color: urgencyColor, size: 32),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "${_currentObstacle.title} • ${_currentObstacle.zoneLabel}",
                                  style: TextStyle(
                                    color: urgencyColor,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w900,
                                  ),
                                ),
                                Text(
                                  "${_currentObstacle.distanceFormatted} (${_currentObstacle.stepsFormatted})",
                                  style: const TextStyle(
                                    color: AppTheme.textPrimary,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Giant Central "TAP ANYWHERE TO HEAR STATUS" Target
              Expanded(
                child: Semantics(
                  label: "Massive touch target. Tap anywhere on this area to hear current obstacle distance and walking advice.",
                  button: true,
                  child: Material(
                    color: AppTheme.cardBackground,
                    borderRadius: BorderRadius.circular(20),
                    child: InkWell(
                      onTap: _announceCurrentStatus,
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.cardBorder, width: 3),
                        ),
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 72,
                                height: 72,
                                decoration: BoxDecoration(
                                  color: AppTheme.accentAmber.withValues(alpha: 0.15),
                                  shape: BoxShape.circle,
                                  border: Border.all(color: AppTheme.accentAmber, width: 2.5),
                                ),
                                child: const Icon(
                                  Icons.touch_app,
                                  size: 40,
                                  color: AppTheme.accentAmber,
                                ),
                              ),
                              const SizedBox(height: 12),
                              const Text(
                                "TAP TO HEAR STATUS",
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  color: AppTheme.textPrimary,
                                  fontSize: 24,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                "Tap anywhere in this box to announce path conditions aloud",
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  color: AppTheme.textSecondary,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Two Primary Action Mode Cards
              Row(
                children: [
                  Expanded(
                    child: Semantics(
                      label: "Open Full Walking Obstacle Radar",
                      button: true,
                      child: SizedBox(
                        height: 82,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const WalkingRadarScreen()),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.cardBackground,
                            side: const BorderSide(color: AppTheme.cardBorder, width: 2.5),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                          ),
                          child: const Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.directions_walk, size: 30, color: AppTheme.accentAmber),
                              SizedBox(height: 4),
                              Text(
                                "WALKING RADAR",
                                style: TextStyle(
                                  color: AppTheme.textPrimary,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Semantics(
                      label: "Open Currency Reader Scanner",
                      button: true,
                      child: SizedBox(
                        height: 82,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const CurrencyScreen()),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.cardBackground,
                            side: const BorderSide(color: AppTheme.cardBorder, width: 2.5),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                          ),
                          child: const Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.payments, size: 30, color: AppTheme.accentBlue),
                              SizedBox(height: 4),
                              Text(
                                "CURRENCY SCAN",
                                style: TextStyle(
                                  color: AppTheme.textPrimary,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // ========================================================
              // Dedicated Voice Assistant Button
              // (Ready for user's upcoming usage specification!)
              // ========================================================
              Semantics(
                label: _isVoiceAssistantListening
                    ? "Voice Assistant is listening. Tap to pause."
                    : "Voice Assistant Button. Tap to speak commands.",
                button: true,
                child: SizedBox(
                  height: 88,
                  child: ElevatedButton(
                    onPressed: _handleVoiceAssistantPressed,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isVoiceAssistantListening
                          ? AppTheme.accentAmber
                          : AppTheme.accentAmber,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                      elevation: 4,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          _isVoiceAssistantListening ? Icons.mic : Icons.mic_none,
                          size: 40,
                          color: AppTheme.background,
                        ),
                        const SizedBox(width: 14),
                        Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _isVoiceAssistantListening
                                  ? "VOICE ASSISTANT (LISTENING)"
                                  : "VOICE ASSISTANT",
                              style: const TextStyle(
                                color: AppTheme.background,
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 0.5,
                              ),
                            ),
                            Text(
                              _isVoiceAssistantListening
                                  ? "Speak your request now..."
                                  : "Tap to ask or give instructions",
                              style: TextStyle(
                                color: AppTheme.background.withValues(alpha: 0.8),
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
