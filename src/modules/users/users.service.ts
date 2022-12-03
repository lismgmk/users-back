import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { path } from 'app-root-path';
import { ensureDir, readFile, readFileSync, writeFile } from 'fs-extra';
import hbs from 'handlebars';
import puppeteer from 'puppeteer';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  COMPILE_PDF_ERROR,
  FIELD_EXIST_VALIDATION_ERROR,
} from '../../consts/ad-validation-const';
import { User } from '../../entities/user.entity';
import { JwtPassService } from '../jwt-pass-service/jwt-pass.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQueryRepository } from './users.queryRepository';
@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    private jwtPassService: JwtPassService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async compile(templateName: string, data: any) {
    const filePath = `${path}/src/templates/${templateName}.hbs`;
    const html = await readFile(filePath, 'utf-8');
    return await hbs.compile(html)(data);
  }

  // async compileHelper(value, format) {
  //   return hbs.registerHelper('dateFormat', function (value, format) {});
  // }

  async getAllUsers() {
    // try {
    //   const browser = await puppeteer.launch({ headless: false });
    //   const page = await browser.newPage();
    //   // const screenShot = await page.screenshot({ path: './img.png' });

    //   const content = await this.compile('index', {
    //     name: 'VOVA',
    //     path: `data:image/png;base64,${readFileSync(
    //       `${path}/upload/images/9aa0ca1d-c9e1-4230-8900-85a6c431de33-Screenshot from 2022-07-31 17-10-23.png`,
    //     ).toString('base64')}`,
    //     // path: `img.png`,
    //   });
    // console.log(`${path}/upload/2022-12-02/img.png`);

    // await page.goto(`file:${filePath}`, { waitUntil: 'networkidle0' });
    // const filePath = path.join(process.cwd(), 'nameOfSavedPdf.html');
    // await page.goto(`${path}/src/templates/index.hbs`, {
    //   waitUntil: 'networkidle0',
    // });

    // await page.setContent(contaent);

    //   const html = `
    //   <html>
    //   <body>
    //     <div class="testing">
    //       <h1>Hello World!</h1>
    //       <img src="data:image/jpeg;base64,${readFileSync(
    //         `${path}/upload/2022-12-02/img.png`,
    //       ).toString('base64')}" alt="alt text" />
    //     </div>
    //   </body>
    //   </html>
    // `;
    // console.log('content', content);

    // await page.setContent(html);
    //   await page.setContent(content);

    //   await page.emulateMediaType('screen');
    //   const pdfFile = await page.pdf({
    //     // path: 'mypdf7.pdf',
    //     format: 'A4',
    //     printBackground: true,
    //   });
    //   console.log('done');
    //   await this.usersQueryRepository.addPdf(email, pdfFile);
    //   console.log(pdfFile.toString('base64'));

    //   await browser.close();
    // } catch (e) {
    //   // await browser.close();
    //   console.log('our log', e);
    // }
    return this.usersQueryRepository.getAllUsers();
  }

  async addPdf(dto: User) {
    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      const content = await this.compile('index', {
        firstName: dto.firstName,
        lastName: dto.lastName,
        path: `data:image/png;base64,${readFileSync(
          `${path}/upload/images/${dto.image}`,
        ).toString('base64')}`,
      });
      await page.setContent(content);

      const pdfFile = await page.pdf({
        format: 'A4',
        printBackground: true,
      });
      await this.usersQueryRepository.addPdf(dto.email, pdfFile);
      await browser.close();
      console.log(pdfFile.toString('base64'));

      return pdfFile.toJSON();
    } catch (err) {
      console.log('our log', err);
      throw new BadRequestException(COMPILE_PDF_ERROR);
    }
  }

  async createUser(dto: CreateUserDto) {
    await this.checkExistUserByNameEmail(dto);
    const hashPassword = await this.jwtPassService.createPassBcrypt(
      dto.password,
    );
    return this.usersQueryRepository.createUser({ ...dto, hashPassword });
  }

  async deleteUserById(id: string) {
    await this.checkExistUserById(id);
    return this.usersQueryRepository.deleteUserById(id);
  }

  async changeUser(dto: UpdateUserDto & { id: string }) {
    await this.checkExistUserById(dto.id);
    return this.usersQueryRepository.changeUser(dto);
  }

  async checkExistUserById(id: string) {
    const user = await this.usersQueryRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException();
    }
    // if (user && id !== user.email) {
    //   throw new BadRequestException({
    //     message: OWNER_ERROR,
    //   });
    // }
  }

  async checkExistUserByNameEmail(
    dto: Omit<CreateUserDto, 'lastName' | 'password'>,
  ) {
    const checkExistUser =
      await this.usersQueryRepository.getUserByEmaiFirstName({
        firstName: dto.firstName,
        email: dto.firstName,
      });

    if (checkExistUser) {
      throw new BadRequestException({
        message: FIELD_EXIST_VALIDATION_ERROR,
      });
    }
  }

  async saveFile(id: string, file: Express.Multer.File) {
    await this.checkExistUserById(id);
    const prefix = uuidv4();
    const fileName = `${prefix}-${file.originalname}`;
    const uploadFolder = `${path}/upload/images`;
    await ensureDir(uploadFolder);
    await writeFile(`${uploadFolder}/${fileName}`, file.buffer);
    await this.usersQueryRepository.addImagePath(id, fileName);
    return {
      url: `/upload/images/${fileName}`,
      name: file.originalname,
    };
  }
}
