import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { path } from 'app-root-path';
import { format } from 'date-fns';
import { hasSubscribers } from 'diagnostics_channel';
import { ensureDir, writeFile, readFile, readFileSync } from 'fs-extra';
import puppeteer from 'puppeteer';
import { DataSource } from 'typeorm';
import { FIELD_EXIST_VALIDATION_ERROR } from '../../consts/ad-validation-const';
import { JwtPassService } from '../jwt-pass-service/jwt-pass.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQueryRepository } from './users.queryRepository';
import hbs from 'handlebars';
import { v4 as uuidv4 } from 'uuid';
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
    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      console.log(`${path}/upload/2022-12-02/img.png`, 'xxxxx', process.cwd());
      // const screenShot = await page.screenshot({ path: './img.png' });

      const content = await this.compile('index', {
        name: 'VOVA',
        path: `data:image/png;base64,${readFileSync(
          `${path}/upload/2022-12-02/img.png`,
        ).toString('base64')}`,
        // path: `img.png`,
      });
      // console.log(`${path}/upload/2022-12-02/img.png`);

      // await page.goto(`file:${filePath}`, { waitUntil: 'networkidle0' });
      // const filePath = path.join(process.cwd(), 'nameOfSavedPdf.html');
      // await page.goto(`${path}/src/templates/index.hbs`, {
      //   waitUntil: 'networkidle0',
      // });

      // await page.setContent(contaent);

      const html = `
      <html>
      <body>
        <div class="testing">
          <h1>Hello World!</h1>
          <img src="data:image/jpeg;base64,${readFileSync(
            `${path}/upload/2022-12-02/img.png`,
          ).toString('base64')}" alt="alt text" />
        </div>
      </body>
      </html>
    `;

      // await page.setContent(html);
      await page.setContent(content);

      await page.emulateMediaType('screen');
      await page.pdf({
        path: 'mypdf7.pdf',
        format: 'A4',
        printBackground: true,
      });
      console.log('done');
      await browser.close();
    } catch (e) {
      console.log('our log', e);
    }
    return this.usersQueryRepository.getAllUsers();
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

  async saveFile(file: Express.Multer.File) {
    const prefix = uuidv4();
    const fileName = `${prefix}-${file.originalname}`;
    // const dateFolder = format(new Date(), 'yyy-MM-dd');
    // const uploadFolder = `${path}/upload/images/${dateFolder}`;
    const uploadFolder = `${path}/upload/images`;
    await ensureDir(uploadFolder);
    await writeFile(`${uploadFolder}/${fileName}`, file.buffer);
    // await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
    return {
      // url: `${dateFolder}/${file.originalname}`,
      url: `/upload/images/${fileName}`,
      // url: `/upload/images/${file.originalname}`,
      // name: file.originalname,
      name: fileName,
    };
  }
}
