import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID } from 'mongodb';
import { UserDbModel, UserRole } from 'models/user.db.model';
import { UserLoginRequest } from 'models/user-login-request.model';
import { IUsersPersistenceService } from './interfaces/users.persistence.service.interface';

@Injectable()
export class UsersPersistenceService implements IUsersPersistenceService {
    private collection: Collection<UserDbModel>;
    private logger = new Logger('UsersPersistenceService');

    constructor(private dbService: DbService) {
        const db = this.dbService.getConnection();
        this.collection = db.collection<UserDbModel>('users');
    }

    private buildMongoFilterFromQuery(query: { [id: string]: any }, id?: string): { [id: string]: string } {
        if (id) {
            const mongoId = new ObjectID(id);
            query._id = mongoId;
        }
        return query;
    }

    async getAll(): Promise<UserDbModel[]> {
        try {
            this.logger.log('UsersPersistenceService::getAll:: fetching users');
            return await this.collection.find({}).toArray();
        } catch (error) {
            this.logger.error('UsersPersistenceService::getAll:: error fetching users', error.stack);
            throw error;
        }
    }

    async getUsersByFilters(queyParams: { [id: string]: string }): Promise<UserDbModel[]> {
        try {
            const mongoQuery = this.buildMongoFilterFromQuery(queyParams);

            this.logger.log(`UsersPersistenceService::getUsersByFilters:: fetching users by parameters `);
            return await this.collection.find(mongoQuery).toArray();
        } catch (error) {
            this.logger.error(`UsersPersistenceService::getUsersByFilters:: error fetching user by parameters`, error.stack);
            throw  error;
        }
    }

    async getUserByFilters(queyParams: { [id: string]: string }, id?: string ): Promise<UserDbModel> {
        try {
            const mongoQuery = this.buildMongoFilterFromQuery(queyParams, id);

            this.logger.log(`UsersPersistenceService::getUsersByFilters:: fetching users by parameters `);
            return await this.collection.findOne(mongoQuery);
        } catch (error) {
            this.logger.error(`UsersPersistenceService::getUsersByFilters:: error fetching user by parameters`, error.stack);
            throw  error;
        }
    }

    // CRUD on users
    async getById(id: string): Promise<UserDbModel> {
        try {
            const mongoId = new ObjectID(id);
            this.logger.log(`UsersPersistenceService::getAll:: fetching user by id ${id}`);
            return await this.collection.findOne({ mongoId });
        } catch (error) {
            this.logger.error(`UsersPersistenceService::getAll:: error fetching user by id ${id}`, error.stack);
            throw error;
        }
    }

    async createUser(user: UserDbModel, userRole?: UserRole): Promise<[Error, UserDbModel]> {
        try {
            this.logger.log(`UsersPersistenceService::createUser:: creates user`);
            if (userRole) {
                user.role = userRole;
            }

            const insertResponse = await this.collection.insertOne(user);

            const newDocument = await this.getById(insertResponse.insertedId.toString());
            this.logger.log(`UsersPersistenceService::createUser:: inserted to DB :${JSON.stringify(newDocument)}`);

            return [null, newDocument];
        } catch (error) {
            this.logger.error(`UsersPersistenceService::createUser:: error adding user `, error.stack);
            return [error, null];
        }
    }

    async updateUser(id: string, user: UserDbModel, userRole?: UserRole): Promise<[Error, UserDbModel]> {
        if (userRole) {
            user.role = userRole;
        }
        const mongoId = new ObjectID(id);
        try {
            this.logger.log(`UsersPersistenceService::updateUser:: updating user ${mongoId}`);
            const currentDoc = await this.getById(id);
            const updatedDocument = await this.collection.findOneAndUpdate({ mongoId }, {...currentDoc, ...user}, { returnOriginal: false});
            this.logger.log(`UsersPersistenceService::updateUser:: updated DB :${JSON.stringify(updatedDocument.value)}`);
            return [null, updatedDocument.value];
        } catch (error) {
            this.logger.error(`UsersPersistenceService::updateUser:: error updating user ${mongoId}`, error.stack);
            return [error, null];
        }
    }

    async deleteUser(id: string): Promise<[Error, number]> {
        try {
            const mongoId = new ObjectID(id);
            this.logger.log(`UsersPersistenceService::deleteUser:: deleting user by id ${id}`);
            const deleteResponse = await this.collection.deleteOne({ mongoId });
            this.logger.log(`UsersPersistenceService::deleteUser:: removed ${deleteResponse.deletedCount} documents`);
            return [null, deleteResponse.deletedCount];
        } catch (error) {
            this.logger.error(`UsersPersistenceService::deleteUser:: error deleting user by id ${id}`, error.stack);
            return [error, null];
        }
    }

    // Authentication
    // TODO move into a specific service
    async authenticateUser({ username, password }: UserLoginRequest): Promise<[Error, UserDbModel]> {
        try {
            this.logger.log(`UsersPersistenceService::authenticateUser:: authenticating user ${username}`);
            return [null, await this.collection.findOne({ username, password })];
        } catch (error) {
            this.logger.error(`UsersPersistenceService::authenticateUser:: error authenticating user ${username}`, error.stack);
            return [error, null];
        }
    }

    async getByUsername(username: string): Promise<[Error, UserDbModel]> {
        try {
            this.logger.log(`UsersPersistenceService::getByUsername:: fetching user by username ${username}`);
            return [null, await this.collection.findOne({ username })];
        } catch (error) {
            this.logger.error(`UsersPersistenceService::getAll:: error fetching user by username ${username}`, error.stack);
            return [error, null];
        }
    }

    // Class
    // TODO move into class service
    async getStudentsByClassId(classId: string): Promise<[Error, UserDbModel[]]> {
        try {
            this.logger.log(`UsersPersistenceService::getStudentsByClassId:: fetching students by class id ${classId}`);
            return [null, await this.collection.find({ classId, role: 'STUDENT' }).toArray()];
        } catch (error) {
            this.logger.error(`UsersPersistenceService::getStudentsByClassId:: error fetching students by class id ${classId}`, error.stack);
            throw [error, null];
        }
    }
}
