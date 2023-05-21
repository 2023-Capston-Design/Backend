import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { mailvalidation } from './schema/mail-validation.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import mailConfig from '../config/config/mail.config';
import { ConfigType } from '@nestjs/config';
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { MailValidationPaylod } from './interface/mailvalidationpayload.interface';
import { EmailOptions } from './interface/emailoption.interface';
import {
  ReceiverNotDefined,
  TokenNotFound,
} from '@src/infrastructure/errors/mail.error';
import jwtConfig from '../config/config/jwt.config';
import {
  InvalidToken,
  TokenExpired,
} from '@src/infrastructure/errors/auth.error';

@Injectable()
export class MailService {
  private transporter: Mail;
  private validationString = 'Mail-validation';

  constructor(
    @InjectModel(mailvalidation.name)
    private readonly mailvalidationModel: Model<mailvalidation>,
    @Inject(mailConfig.KEY)
    private readonly mailSetting: ConfigType<typeof mailConfig>,
    @Inject(jwtConfig.KEY)
    private readonly jwtSettings: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: mailSetting.id,
        pass: mailSetting.pw,
      },
    });
  }

  public async validateMail(token: string) {
    if (!token) {
      throw new InvalidToken();
    }
    const findToken = await this.mailvalidationModel.findOne({
      token,
    });
    if (!findToken) {
      throw new TokenNotFound();
    }
    let payload: MailValidationPaylod;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSettings.secret,
      });
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        throw new InvalidToken();
      } else if (err.name === 'TokenExpiredError') {
        throw new TokenExpired();
      }
    }
    if (payload.validationString !== this.validationString) {
      throw new InvalidToken();
    }
  }

  public async validateMailRequest(to: string) {
    if (!to) {
      throw new ReceiverNotDefined();
    }
    const newToken = await this.jwtService.signAsync({
      validationString: this.validationString,
    } as MailValidationPaylod);
    await this.mailvalidationModel.create({
      token: newToken,
    });
    const validationEndpoint = `${this.mailSetting.api_gw}/mail/validate/${newToken}`;
    const mailOptions: EmailOptions = {
      to,
      subject: '회원가입 이메일 인증',
      html: `
      가입 확인 버튼을 눌러 인증을 진행해 주세요. <br/>
      <form action="${validationEndpoint}" method="POST">
        <button>가입확인</button>
      </form> 
      `,
    };
    return await this.transporter.sendMail(mailOptions);
  }
}
