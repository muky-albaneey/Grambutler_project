import { Injectable } from '@nestjs/common';
import { LegalRepository } from '../repositories';

@Injectable()
export class LegalService {
  constructor(private readonly legalRepository: LegalRepository) {}

  // createLegal(createLegalDto: CreateLegalDto): Promise<Legal> {
  //   return this.legalRepository.create(createLegalDto);
  // }

  // findAll(): Promise<Legal[]> {
  //   return this.legalRepository.find({});
  // }

  // findOne(id: string): Promise<Legal> {
  //   return this.legalRepository.findOne({ id });
  // }

  // update(id: string, updateLegalDto: UpdateLegalDto): Promise<Legal> {
  //   return this.legalRepository.findOneAndUpdate({ id }, updateLegalDto);
  // }

  // remove(id: string): Promise<boolean> {
  //   return this.legalRepository.deleteMany({ id });
  // }
}
