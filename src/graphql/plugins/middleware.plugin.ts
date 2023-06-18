import { TokenValidator } from '../jwt/validator.jwt';
import { JwtService } from '@nestjs/jwt';
export const myPlugin = {
  async serverWillStart() {
    console.log('Server starting up!');
  },
  async requestDidStart(requestContext) {
    // console.log(requestContext);
    const req = requestContext.contextValue.req; // Obtén la solicitud HTTP

    // Extraer el token de los headers de la solicitud
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No token provided');
      throw new Error('No token provided');
    }

    const token = authHeader.split(' ')[1]; // Suponiendo que estás usando el formato "Bearer <token>"

    // console.log('Token', token);
    const jwtService = new JwtService({
      secret: 'ThisIsMySecret',
    });
    const tokenValidator = new TokenValidator(jwtService);
    try {
      // Verificar el token
      const decoded = tokenValidator.validateToken(token);
      // console.log('Token is valid', decoded);
    } catch (err) {
      console.log('Token is invalid', err);
      throw new Error('Token is invalid');
    }
  },
};
