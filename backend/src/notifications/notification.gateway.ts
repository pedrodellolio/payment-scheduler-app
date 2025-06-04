import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/auth/jwt/ws-jwt.guard';
import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const { cookie: cookieHeader } = client.handshake.headers;

      if (!cookieHeader) {
        throw new UnauthorizedException('No cookies found');
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies['accessToken'];
      console.log(token);
      if (!token) {
        throw new UnauthorizedException('Authentication token not found');
      }

      const payload = this.jwtService.verify(token);
      client.data.user = payload;
    } catch (err) {
      client.disconnect(true);
    }
  }
}
