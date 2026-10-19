// Infrastructure: Dependency Injection Container (Manual DI)

import { pool } from './database/pool';
import { env } from './config/env';

// Repositories
import { MySqlUserRepository } from './repositories/MySqlUserRepository';
import { MySqlWorkoutRepository } from './repositories/MySqlWorkoutRepository';
import { MySqlSquadRepository } from './repositories/MySqlSquadRepository';
import { MySqlExerciseRepository } from './repositories/MySqlExerciseRepository';
import { MySqlNutritionRepository } from './repositories/MySqlNutritionRepository';

// Services
import { JwtTokenService } from './security/JwtTokenService';
import { Argon2PasswordHasher } from './security/Argon2PasswordHasher';
import { NodemailerEmailService } from './services/NodemailerEmailService';
import { GoogleOAuthProvider } from './services/GoogleOAuthProvider';

// Use cases
import { RegisterUser } from '../application/use-cases/auth/RegisterUser';
import { LoginUser } from '../application/use-cases/auth/LoginUser';
import { RefreshSession } from '../application/use-cases/auth/RefreshSession';
import { LogoutUser } from '../application/use-cases/auth/LogoutUser';
import { GoogleLogin } from '../application/use-cases/auth/GoogleLogin';
import { RequestPasswordReset } from '../application/use-cases/auth/RequestPasswordReset';
import { ResetPassword } from '../application/use-cases/auth/ResetPassword';
import { ChangePassword } from '../application/use-cases/auth/ChangePassword';

import { StartWorkoutSession } from '../application/use-cases/workout/StartWorkoutSession';
import { LogExerciseSet } from '../application/use-cases/workout/LogExerciseSet';
import { FinishWorkoutSession } from '../application/use-cases/workout/FinishWorkoutSession';

import { CreateSquad } from '../application/use-cases/squads/CreateSquad';
import { ProvisionStudent } from '../application/use-cases/squads/ProvisionStudent';

import { CalculateTdee } from '../application/use-cases/nutrition/CalculateTdee';
import { LogNutrition } from '../application/use-cases/nutrition/LogNutrition';

// Controllers
import { AuthController } from './http/controllers/AuthController';
import { WorkoutController } from './http/controllers/WorkoutController';
import { SquadController } from './http/controllers/SquadController';
import { NutritionController } from './http/controllers/NutritionController';

export interface Container {
  authController: AuthController;
  workoutController: WorkoutController;
  squadController: SquadController;
  nutritionController: NutritionController;
}

export function createContainer(): Container {
  // 1. Repositorios
  const userRepository = new MySqlUserRepository(pool);
  const workoutRepository = new MySqlWorkoutRepository(pool);
  const squadRepository = new MySqlSquadRepository(pool);
  const _exerciseRepository = new MySqlExerciseRepository(pool);
  const nutritionRepository = new MySqlNutritionRepository(pool);

  // 2. Servicios
  const tokenService = new JwtTokenService();
  const passwordHasher = new Argon2PasswordHasher();
  const emailService = new NodemailerEmailService();
  const googleAuthProvider = new GoogleOAuthProvider();

  // 3. Casos de uso - Auth
  const registerUser = new RegisterUser(userRepository, passwordHasher, tokenService);
  const loginUser = new LoginUser(userRepository, passwordHasher, tokenService);
  const refreshSession = new RefreshSession(userRepository, tokenService);
  const logoutUser = new LogoutUser(userRepository);
  const googleLogin = new GoogleLogin(userRepository, googleAuthProvider, tokenService);
  const requestPasswordReset = new RequestPasswordReset(userRepository, emailService, env.APP_URL);
  const resetPassword = new ResetPassword(userRepository, passwordHasher);
  const changePassword = new ChangePassword(userRepository, passwordHasher);

  // 4. Casos de uso - Workout
  const startWorkoutSession = new StartWorkoutSession(workoutRepository);
  const logExerciseSet = new LogExerciseSet(workoutRepository);
  const finishWorkoutSession = new FinishWorkoutSession(workoutRepository);

  // 5. Casos de uso - Squads
  const createSquad = new CreateSquad(squadRepository);
  const provisionStudent = new ProvisionStudent(userRepository, squadRepository, passwordHasher, emailService, env.APP_URL);

  // 6. Casos de uso - Nutrición
  const calculateTdee = new CalculateTdee();
  const logNutrition = new LogNutrition(nutritionRepository);

  // 7. Controladores
  const authController = new AuthController(
    registerUser,
    loginUser,
    refreshSession,
    logoutUser,
    googleLogin,
    requestPasswordReset,
    resetPassword,
    changePassword
  );

  const workoutController = new WorkoutController(
    startWorkoutSession,
    logExerciseSet,
    finishWorkoutSession,
    workoutRepository
  );

  const squadController = new SquadController(createSquad, provisionStudent, squadRepository);
  const nutritionController = new NutritionController(logNutrition, calculateTdee, nutritionRepository);

  return {
    authController,
    workoutController,
    squadController,
    nutritionController
  };
}
