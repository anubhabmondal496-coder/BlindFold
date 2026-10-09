import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'screens/home_screen.dart';
import 'services/voice_service.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Force portrait orientation for reliable tactile muscle memory
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);

  // Set immersive dark system UI navigation overlay
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppTheme.background,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  // Pre-initialize TTS service
  await VoiceService.instance.init();

  runApp(const BlindFoldApp());
}

class BlindFoldApp extends StatelessWidget {
  const BlindFoldApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BlindFold',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTactileTheme,
      home: const HomeScreen(),
    );
  }
}
