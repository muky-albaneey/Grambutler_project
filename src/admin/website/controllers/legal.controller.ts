import {
  Controller,
  // Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { LegalService } from '../services';

@Controller('legal')
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  // @Post()
  // create(@Body() createLegalDto: CreateLegalDto): Promise<Legal> {
  //   return this.legalService.create(createLegalDto);
  // }

  // @Get()
  // findAll(): Promise<Legal[]> {
  //   return this.legalService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<Legal> {
  //   return this.legalService.findOne(id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateLegalDto: UpdateLegalDto,
  // ): Promise<Legal> {
  //   return this.legalService.update(id, updateLegalDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string): Promise<boolean> {
  //   return this.legalService.remove(id);
  // }
}
