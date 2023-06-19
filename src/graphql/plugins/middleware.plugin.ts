import { TokenValidator } from '../jwt/validator.jwt';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
const logger = new Logger('ApolloServer');
export const myPlugin = {
  async serverWillStart() {
    logger.log('ApolloServer is starting up...');
  },
  async requestDidStart(requestContext) {
    const req = requestContext.contextValue.req;

    // Extraer el token de los headers de la solicitud
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('No token provided');
    }

    const token = authHeader.split(' ')[1];

    const jwtService = new JwtService({
      secret: 'ThisIsMySecret',
      signOptions: { expiresIn: '7d' },
    });
    const tokenValidator = new TokenValidator(jwtService);
    try {
      // Verificar el token
      const decoded = tokenValidator.validateToken(token);
    } catch (err) {
      logger.error('Token is invalid', err);
      throw new Error('Token is invalid');
    }
  },
};
