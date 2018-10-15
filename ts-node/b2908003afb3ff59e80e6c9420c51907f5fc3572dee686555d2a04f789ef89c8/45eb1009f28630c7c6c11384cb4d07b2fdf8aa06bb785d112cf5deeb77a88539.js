"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const common_1 = require("@nestjs/common");
class CRUDPersistance {
    constructor(collectionName, dbService) {
        this.collectionName = collectionName;
        this.dbService = dbService;
        const db = this.dbService.getConnection();
        this.collection = db.collection(collectionName);
        this.logger = new common_1.Logger(`${collectionName}_PersistenceService`);
    }
    async getAll() {
        try {
            this.logger.log(`getAll:: fetching ${this.collectionName}`);
            return await this.collection.find({}).toArray();
        }
        catch (error) {
            this.logger.error(`getAll:: error fetching ${this.collectionName}`, error.stack);
            throw error;
        }
    }
    async getById(id) {
        try {
            const mongoId = new mongodb_1.ObjectID(id);
            this.logger.log(`getAll:: fetching document by id ${id} from ${this.collectionName}`);
            return await this.collection.findOne({ _id: mongoId });
        }
        catch (error) {
            this.logger.error(`getAll:: error fetching document by id ${id} from ${this.collectionName}`, error.stack);
            throw error;
        }
    }
    async create(newDocument) {
        try {
            this.logger.log(`create:: creating new document in ${this.collectionName}`);
            const insertResponse = await this.collection.insertOne(newDocument);
            return await this.getById(insertResponse.insertedId.toString());
        }
        catch (error) {
            this.logger.error(`create:: error creating new document in ${this.collectionName}`, error.stack);
            throw error;
        }
    }
    async update(id, documentToUpdate) {
        const mongoId = new mongodb_1.ObjectID(id);
        try {
            this.logger.log(`update:: updating document ${mongoId} in ${this.collectionName}`);
            const updatedDocument = await this.collection.findOneAndUpdate({ _id: mongoId }, documentToUpdate, { returnOriginal: false });
            this.logger.log(`update:: updated document ${mongoId} from ${this.collectionName}`);
            return updatedDocument.value;
        }
        catch (error) {
            this.logger.error(`update error updating document ${mongoId} in ${this.collectionName}`, error.stack);
            throw error;
        }
    }
    async deleteClass(id) {
        try {
            const mongoId = new mongodb_1.ObjectID(id);
            this.logger.log(`delete:: deleting document ${id} from ${this.collectionName}`);
            const deleteResponse = await this.collection.deleteOne({ _id: mongoId });
            this.logger.log(`delete:: removed document ${id} from ${this.collectionName}`);
            return deleteResponse.deletedCount;
        }
        catch (error) {
            this.logger.error(`delete:: error deleting document ${id} from ${this.collectionName}`, error.stack);
            throw error;
        }
    }
}
exports.CRUDPersistance = CRUDPersistance;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2R2ZXJub3Zza3kvcHJvZ3JhbW1pbmcvbXktc3BlY2lhbC13YXkvbXktc3BlY2lhbC13YXktc2VydmVyL3NyYy9tb2R1bGVzL3BlcnNpc3RlbmNlL2NydWQtcGVyc2lzdGFuY2Uuc2VydmljZS50cyIsInNvdXJjZXMiOlsiL1VzZXJzL2R2ZXJub3Zza3kvcHJvZ3JhbW1pbmcvbXktc3BlY2lhbC13YXkvbXktc3BlY2lhbC13YXktc2VydmVyL3NyYy9tb2R1bGVzL3BlcnNpc3RlbmNlL2NydWQtcGVyc2lzdGFuY2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUErQztBQUUvQywyQ0FBd0M7QUFFeEM7SUFJSSxZQUFvQixjQUFzQixFQUFVLFNBQW9CO1FBQXBELG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUNwRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBSSxjQUFjLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLEdBQUcsY0FBYyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTTtRQUNSLElBQUk7WUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7WUFDNUQsT0FBTyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ25EO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDWixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FB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QUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7WUFDL0UsT0FBTyxjQUFjLENBQUMsWUFBWSxDQUFDO1NBQ3RDO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDWixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsRUFBRSxTQUFTLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckcsTUFBTSxLQUFLLENBQUM7U0FDZjtJQUNMLENBQUM7Q0FDSjtBQXhFRCwwQ0F3RUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb2xsZWN0aW9uLCBPYmplY3RJRCB9IGZyb20gJ21vbmdvZGInO1xuaW1wb3J0IHsgRGJTZXJ2aWNlIH0gZnJvbSAnLi9kYi5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJ0BuZXN0anMvY29tbW9uJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENSVURQZXJzaXN0YW5jZTxUPiB7XG4gICAgcHJvdGVjdGVkIGNvbGxlY3Rpb246IENvbGxlY3Rpb248VD47XG4gICAgcHJvdGVjdGVkIGxvZ2dlcjogTG9nZ2VyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBwcml2YXRlIGRiU2VydmljZTogRGJTZXJ2aWNlKSB7XG4gICAgICAgIGNvbnN0IGRiID0gdGhpcy5kYlNlcnZpY2UuZ2V0Q29ubmVjdGlvbigpO1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb24gPSBkYi5jb2xsZWN0aW9uPFQ+KGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKGAke2NvbGxlY3Rpb25OYW1lfV9QZXJzaXN0ZW5jZVNlcnZpY2VgKTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRBbGwoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coYGdldEFsbDo6IGZldGNoaW5nICR7dGhpcy5jb2xsZWN0aW9uTmFtZX1gKTtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNvbGxlY3Rpb24uZmluZCh7fSkudG9BcnJheSgpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoYGdldEFsbDo6IGVycm9yIGZldGNoaW5nICR7dGhpcy5jb2xsZWN0aW9uTmFtZX1gLCBlcnJvci5zdGFjayk7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGdldEJ5SWQoaWQ6IHN0cmluZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbW9uZ29JZCA9IG5ldyBPYmplY3RJRChpZCk7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coYGdldEFsbDo6IGZldGNoaW5nIGRvY3VtZW50IGJ5IGlkICR7aWR9IGZyb20gJHt0aGlzLmNvbGxlY3Rpb25OYW1lfWApO1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY29sbGVjdGlvbi5maW5kT25lKHsgX2lkOiBtb25nb0lkIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoYGdldEFsbDo6IGVycm9yIGZldGNoaW5nIGRvY3VtZW50IGJ5IGlkICR7aWR9IGZyb20gJHt0aGlzLmNvbGxlY3Rpb25OYW1lfWAsIGVycm9yLnN0YWNrKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgY3JlYXRlKG5ld0RvY3VtZW50OiBUKTogUHJvbWlzZTxUPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5sb2coYGNyZWF0ZTo6IGNyZWF0aW5nIG5ldyBkb2N1bWVudCBpbiAke3RoaXMuY29sbGVjdGlvbk5hbWV9YCk7XG4gICAgICAgICAgICBjb25zdCBpbnNlcnRSZXNwb25zZSA9IGF3YWl0IHRoaXMuY29sbGVjdGlvbi5pbnNlcnRPbmUobmV3RG9jdW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0QnlJZChpbnNlcnRSZXNwb25zZS5pbnNlcnRlZElkLnRvU3RyaW5nKCkpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoYGNyZWF0ZTo6IGVycm9yIGNyZWF0aW5nIG5ldyBkb2N1bWVudCBpbiAke3RoaXMuY29sbGVjdGlvbk5hbWV9YCwgZXJyb3Iuc3RhY2spO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGUoaWQ6IHN0cmluZywgZG9jdW1lbnRUb1VwZGF0ZTogVCk6IFByb21pc2U8VD4ge1xuICAgICAgICBjb25zdCBtb25nb0lkID0gbmV3IE9iamVjdElEKGlkKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmxvZyhgdXBkYXRlOjogdXBkYXRpbmcgZG9jdW1lbnQgJHttb25nb0lkfSBpbiAke3RoaXMuY29sbGVjdGlvbk5hbWV9YCk7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGVkRG9jdW1lbnQgPSBhd2FpdCB0aGlzLmNvbGxlY3Rpb24uZmluZE9uZUFuZFVwZGF0ZShcbiAgICAgICAgICAgICAgICB7IF9pZDogbW9uZ29JZCB9LFxuICAgICAgICAgICAgICAgIGRvY3VtZW50VG9VcGRhdGUsXG4gICAgICAgICAgICAgICAgeyByZXR1cm5PcmlnaW5hbDogZmFsc2UgfSxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmxvZyhgdXBkYXRlOjogdXBkYXRlZCBkb2N1bWVudCAke21vbmdvSWR9IGZyb20gJHt0aGlzLmNvbGxlY3Rpb25OYW1lfWApO1xuICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZWREb2N1bWVudC52YWx1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGB1cGRhdGUgZXJyb3IgdXBkYXRpbmcgZG9jdW1lbnQgJHttb25nb0lkfSBpbiAke3RoaXMuY29sbGVjdGlvbk5hbWV9YCwgZXJyb3Iuc3RhY2spO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBkZWxldGVDbGFzcyhpZDogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG1vbmdvSWQgPSBuZXcgT2JqZWN0SUQoaWQpO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nKGBkZWxldGU6OiBkZWxldGluZyBkb2N1bWVudCAke2lkfSBmcm9tICR7dGhpcy5jb2xsZWN0aW9uTmFtZX1gKTtcbiAgICAgICAgICAgIGNvbnN0IGRlbGV0ZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5jb2xsZWN0aW9uLmRlbGV0ZU9uZSh7IF9pZDogbW9uZ29JZCB9KTtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmxvZyhgZGVsZXRlOjogcmVtb3ZlZCBkb2N1bWVudCAke2lkfSBmcm9tICR7dGhpcy5jb2xsZWN0aW9uTmFtZX1gKTtcbiAgICAgICAgICAgIHJldHVybiBkZWxldGVSZXNwb25zZS5kZWxldGVkQ291bnQ7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihgZGVsZXRlOjogZXJyb3IgZGVsZXRpbmcgZG9jdW1lbnQgJHtpZH0gZnJvbSAke3RoaXMuY29sbGVjdGlvbk5hbWV9YCwgZXJyb3Iuc3RhY2spO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=