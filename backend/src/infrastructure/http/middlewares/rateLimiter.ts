// Infrastructure HTTP Middleware: rateLimiter

import rateLimit from 'express-rate-limit';

// Limitador general para API
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiadas solicitudes',
    message: 'Has excedido el limite de solicitudes permitidas. Por favor, reintenta mas tarde.'
  }
});

// Limitador estricto para rutas criticas de autenticacion
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30, // 30 intentos por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiados intentos de acceso',
    message: 'Demasiadas solicitudes de autenticacion desde esta direccion IP. Intenta nuevamente en 15 minutos.'
  }
});
