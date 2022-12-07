import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { path } from 'app-root-path';
import { DataSource } from 'typeorm';
import { UsersQueryRepository } from './users.queryRepository';
import { ensureDir, readFile, readFileSync, writeFile } from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import hbs from 'handlebars';
import puppeteer from 'puppeteer';
import { User } from '../../entities/user.entity';
import { COMPILE_PDF_ERROR } from '../../consts/ad-validation-const';
import { IFileResponse, IPdfResponse } from './dto/users-interfaces.dto';
import { ICompileDto } from './dto/compile-interface';

@Injectable()
export class CompileService {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async compile(templateName: string, data: ICompileDto) {
    const filePath = `${path}/src/templates/${templateName}.hbs`;
    const html = await readFile(filePath, 'utf-8');
    return await hbs.compile(html)(data);
  }

  async addPdf(dto: User): Promise<IPdfResponse> {
    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      const content = await this.compile('index', {
        firstName: dto.firstName,
        lastName: dto.lastName,
        path: `data:image/png;base64,${readFileSync(
          `${path}/src/upload/images/${dto.image}`,
        ).toString('base64')}`,
      });
      await page.setContent(content);

      const pdfFile = await page.pdf({
        format: 'A4',
        printBackground: true,
      });
      await this.usersQueryRepository.addPdf(dto.email, pdfFile);
      await browser.close();
      return pdfFile.toJSON();
    } catch (err) {
      throw new BadRequestException(COMPILE_PDF_ERROR);
    }
  }

  async saveFile(
    id: string,
    file: Express.Multer.File,
  ): Promise<IFileResponse> {
    const prefix = uuidv4();
    const fileName = `${prefix}-${file.originalname}`;
    const uploadFolder = `${path}/src/upload/images`;
    console.log(
      uploadFolder,
      'fffffffffffffolder',
      fileName,
      'filName!!!!!!!!',
    );

    try {
      await ensureDir(uploadFolder, (err) => {
        if (err) return console.log(err);
        console.log('Directory exists');
      });
    } catch (e) {
      console.log('errror ensureDir', e);
    }

    try {
      await writeFile(`${uploadFolder}/${fileName}`, file.buffer);
    } catch (e) {
      console.log('errror writeDir', e);
    }
    await ensureDir(uploadFolder);
    await writeFile(`${uploadFolder}/${fileName}`, file.buffer);
    await this.usersQueryRepository.addImagePath(id, fileName);
    return {
      url: `/src/upload/images/${fileName}`,
      name: file.originalname,
    };
  }
}
