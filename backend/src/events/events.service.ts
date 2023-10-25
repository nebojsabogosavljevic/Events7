import { Injectable, HttpException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Response } from './entities/response.entity';

@Injectable()
export class EventsService {
  constructor(@InjectModel('Event') private eventModel: Model<Event>) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    try {
      const createdEvent = new this.eventModel(createEventDto);
      await createdEvent.save();

      return createdEvent;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async findAll(): Promise<Event[]> {
    const results = await this.eventModel.find().exec();
    return results;
  }

  async findOne(id: number): Promise<Event> {
    const result = await this.eventModel.findOne({ _id: new ObjectId(id) });
    return result;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Response> {
    let status = false;
    let message = 'Event not updated';
    try {
      const updateEvent = await this.eventModel.updateOne({_id: new ObjectId(id)}, updateEventDto);
      if (updateEvent.modifiedCount === 0) {
        throw new HttpException('Event not updated', 404);
      }
      status = true;
      message = 'Event updated';
    } catch (error) {
      throw new HttpException(error.message, 404);
    } finally {
      return { status, message };
    }
  }

  async remove(id: string): Promise<Response> {
    let status = false;
    let message = 'Event not deleted';
    try {
      const deleteResult = await this.eventModel.findOneAndRemove({ _id: new ObjectId(id) });
      if (!deleteResult) {
        throw new HttpException('Event not deleted', 404);
      }
      status = true;
      message = 'Event deleted';
    } catch (error) {
      throw new HttpException(error.message, 404);
    } finally {
      return { status, message };
    }
  }

  async deleteSelectedEvents(ids: string[]): Promise<Response> {
    let status = false;
    let message = 'Events not deleted';
    try {
      const deleteQuery = this.eventModel.deleteMany({ _id: { $in: ids } });
      const deleteResult = await deleteQuery.exec();
  
      if (deleteResult.deletedCount === 0) {
        throw new HttpException('Events not deleted', 404);
      }
      status = true;
      message = 'Events deleted';
    } catch (error) {
      throw new HttpException(error.message, 404);
    } finally {
      return { status, message };
    }
  }
}
