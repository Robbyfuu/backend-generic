import { TokenValidator } from '../jwt/validator.jwt';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
const logger = new Logger('ApolloServer');
export const myPlugin = {
  async serverWillStart() {
    logger.log('ApolloServer is starting up...');
  },
  async requestDidStart(requestContext) {
    // console.log(requestContext);
    const req = requestContext.contextValue.req; // Obtén la solicitud HTTP

    // Extraer el token de los headers de la solicitud
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // console.log('No token provided');
      throw new Error('No token provided');
    }

    const token = authHeader.split(' ')[1]; // Suponiendo que estás usando el formato "Bearer <token>"

    // console.log('Token', token);
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
