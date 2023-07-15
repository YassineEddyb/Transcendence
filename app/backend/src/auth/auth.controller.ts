import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, HttpStatus, Post, Query, Redirect, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { lastValueFrom, map, tap } from 'rxjs';
import { User } from 'src/databases/user.entity';
import { Repository } from 'typeorm';
import { GoogleAuthGuard } from './googleapi/googleguard';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt/jwtGuard';
import { FortyTwoGuard } from './42api/42guard';
import { AuthGuard } from '@nestjs/passport';
import { userSignInDto } from './dto/userSignInDto';
import { userSignUpDto } from './dto/userSignUpDto';
import { LocalGuard } from './local/localguard';
import { MailTemplate } from './MailService/mailer.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly configService: ConfigService,
        private readonly httpServer: HttpService,
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly authService: AuthService,
        private readonly mailTemp: MailTemplate) {}


    @Get('google')
    @UseGuards(GoogleAuthGuard)
    googleLogin() {}

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleRedirect(@Req() googlereq, @Res() res: Response)
    {
        const token = await this.authService.apisignin(googlereq.user);
        this.authService.setResCookie(res, token);
        return res.redirect('http://localhost:5173/');
    }
    
    @Get('test')
    test() {
        this.mailTemp.sendEmail();
    }

    @Get('42')
    @UseGuards(FortyTwoGuard)
    fortyTwoLogin() {
    }


    @Get('42api')
    @UseGuards(FortyTwoGuard)
    async fortyTwoRedirect(@Req() fortyTworeq, @Res() res: Response)
    {
        const token = await this.authService.apisignin(fortyTworeq.user);
        if(!token)
            return res.redirect('http://localhost:5173/');
        this.authService.setResCookie(res, token);
        return res.redirect('http://localhost:5173/');
    }

    @Post('signin') 
    @UseGuards(LocalGuard)
    async localSignIn(@Body() userDto: userSignInDto, @Res() res: Response) {
        const token = await this.authService.validateUser(userDto.username, userDto.password);
        this.authService.setResCookie(res, token);
        return res.redirect('http://localhost:5173/');
    }
    
    @Post('signup')
    async localSignUp(@Body() userDto: userSignUpDto, @Res() res: Response) {
        const token = await this.authService.signup(userDto);
        this.authService.setResCookie(res, token);
        return res.redirect('http://localhost:5173/');
    }
}
