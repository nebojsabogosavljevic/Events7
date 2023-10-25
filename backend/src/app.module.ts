import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
@Module({
  imports: [MongooseModule.forRoot(mongoURI), EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
