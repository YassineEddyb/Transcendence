import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/databases/user.entity';
import { googleStrategy } from './googleapi/googleStrategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { fortyTwoStrategy } from './42api/42Strategy';
import { JwtStrategy } from './jwt/jwtStrategy';
import { PassportModule } from '@nestjs/passport';
import { MailTemplate } from './MailService/mailer.service';
import { UserService } from 'src/user/user.service';
import { AchievementService } from 'src/databases/achievement/achievement.service';
import { AchievementModule } from 'src/databases/achievement/achievement.module';
import { Achievement } from 'src/databases/achievement/achievement.entity';
import { Stats } from 'src/databases/stats.entity';
import { BlockedTokenlistService } from 'src/databases/BlockedTokenList/BlockedTokenList.service';
import { BlockedTokenList } from 'src/databases/BlockedTokenList/BlockedTokenList.entity';
import { RequestProvider } from './jwt/ExecutionContext';

const jwtFactory = {
  useFactory: async (configService: ConfigService) => ({
    global: true,
    secret: configService.get('JWT_SECRET'),
  }),
  inject: [ConfigService],
};
@Module({
  controllers: [AuthController],
  imports: [HttpModule, TypeOrmModule.forFeature([User, Achievement, Stats, BlockedTokenList]),
   JwtModule.registerAsync(jwtFactory), PassportModule ],
  providers: [googleStrategy, AuthService, fortyTwoStrategy, JwtStrategy
    , MailTemplate, UserService, AchievementService, BlockedTokenlistService, RequestProvider],
})

export class AuthModule {

}
