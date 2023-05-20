import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
    TypeOrmModule.forFeature([])
  ],
  providers: [ManagerService],
  controllers: [ManagerController]
})
export class ManagerModule {}
