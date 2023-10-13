import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { createMock } from '@golevelup/nestjs-testing';
import { Model, Query } from 'mongoose';

import { UserService } from './user.service';
import { IUserModel, IUser } from '../.@interfaces/user.interface';

const usersMock = [
  {_id: "123"}
]

describe('UsersService', () => {
  let service: UserService;
  let model: Model<IUserModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('user'),
          // notice that only the functions we call from the model are mocked
          useValue: {
            // new: jest.fn().mockResolvedValue(mockCat()),
            // constructor: jest.fn().mockResolvedValue(mockCat()),
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<IUserModel>>(getModelToken('user'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user by ', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<Query<IUserModel, IUserModel>>({
        exec: jest
          .fn()
          .mockResolvedValueOnce(
            mockCatDoc({ name: 'Mufasa', id: 'the dead king' }),
          ),
      }),
    );
  });

  // it('should return user by id', async () => {
  //   // jest.spyOn(model, 'findOne').mockReturnValue({
  //   //   exec: jest.fn().mockResolvedValueOnce(usersMock),
  //   // } as any);
  //   // const users = await service.findById("123");
  //   // expect(users).toEqual(usersMock);
  //   // console.log(users)
  // });

});
