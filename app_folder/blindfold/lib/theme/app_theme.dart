import 'package:flutter/material.dart';

class AppTheme {
  // Ultra-High Contrast Minimalist Palette (WCAG AAA compliant)
  static const Color background = Color(0xFF0A0F1D);       // Deep Pitch Slate
  static const Color cardBackground = Color(0xFF1E293B);   // Charcoal Card
  static const Color cardBorder = Color(0xFF334155);       // Tactile Slate Border
  static const Color textPrimary = Color(0xFFFFFFFF);      // Crisp Pure White
  static const Color textSecondary = Color(0xFF94A3B8);    // Soft Slate
  
  // Tactical Attention Colors
  static const Color accentAmber = Color(0xFFFACC15);      // High-Visibility Amber
  static const Color accentBlue = Color(0xFF38BDF8);       // Electric Sky Blue
  static const Color alertCritical = Color(0xFFEF4444);    // Urgent Hazard Red
  static const Color alertSafe = Color(0xFF22C55E);        // Safe Emerald Green

  static ThemeData get darkTactileTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: accentAmber,
      colorScheme: const ColorScheme.dark(
        surface: cardBackground,
        primary: accentAmber,
        secondary: accentBlue,
        error: alertCritical,
        onSurface: textPrimary,
      ),
      fontFamily: 'Roboto',
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          color: textPrimary,
          fontSize: 32,
          fontWeight: FontWeight.w900,
          letterSpacing: -0.5,
        ),
        headlineMedium: TextStyle(
          color: textPrimary,
          fontSize: 26,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.2,
        ),
        titleLarge: TextStyle(
          color: textPrimary,
          fontSize: 22,
          fontWeight: FontWeight.w800,
        ),
        bodyLarge: TextStyle(
          color: textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.w700,
          height: 1.4,
        ),
        bodyMedium: TextStyle(
          color: textSecondary,
          fontSize: 16,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
