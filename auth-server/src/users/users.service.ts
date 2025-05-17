import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';

@Injectable()

export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    // 역할 변경
    async updateRoleByLoginId(loginId: string, newRole: Role) {
        const user = await this.userModel.findOne({ loginId });
        if (!user) {
            throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
        }

        user.role = newRole;
        await user.save();
        return user;
    }

    // 유저 생성
    async create(createUserDto: CreateUserDto): Promise<User> {
        const { loginId, password, nickname } = createUserDto;

        // ID 중복 검사
        const existsLoginId = await this.userModel.exists({ loginId });
        if (existsLoginId) {
            throw new ConflictException('이미 사용 중인 로그인 ID입니다.');
        }

        // 닉네임 중복 검사
        const existsNickname = await this.userModel.exists({ nickname });
        if (existsNickname) {
            throw new ConflictException('이미 사용 중인 닉네임입니다.');
        }

        // userCode 생성 ex) user_00000
        const userCount = await this.userModel.countDocuments();
        const userCode = `user_${String(userCount + 1).padStart(5, '0')}`;

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new this.userModel({
            loginId,
            password: hashedPassword,
            nickname,
            role: 'USER',
            userCode,
        });

        return await newUser.save();
    }

    // 로그인 아이디로 유저 검색
    async findByLoginId(loginId: string) {
        return await this.userModel.findOne({ loginId });
    }

}
