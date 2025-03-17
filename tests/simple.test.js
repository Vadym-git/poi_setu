(async () => {
    const { expect } = (await import('chai')).default;
    const { Category } = await import('../models.mjs'); // Імпорт моделі Category
    const mongoose = await import('mongoose');
    const { MongoMemoryServer } = await import('mongodb-memory-server');

    describe('Category Model Tests', function () {
        let mongoServer;

        before(async () => {
            // Створюємо інстанс MongoMemoryServer
            mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            
            // Підключення до бази даних в пам'яті
            await mongoose.default.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        });

        after(async () => {
            // Очищення бази даних і закриття з'єднання після тесту
            await mongoose.default.connection.dropDatabase();
            await mongoose.default.connection.close();
            await mongoServer.stop();
        });

        it('should create a new category', async () => {
            const category = await Category.create({ name: 'Food' });

            expect(category).to.have.property('name').that.equals('food');
            expect(category).to.have.property('_id');
        });

        it('should get a category by name', async () => {
            const category = await Category.create({ name: 'Travel' });

            const foundCategory = await Category.findOne({ name: 'travel' });

            expect(foundCategory).to.not.be.null;
            expect(foundCategory.name).to.equal('travel');
        });

        it('should delete a category', async () => {
            const category = await Category.create({ name: 'Sports' });

            await Category.deleteOne({ _id: category._id });

            const deletedCategory = await Category.findById(category._id);

            expect(deletedCategory).to.be.null;
        });
    });
})();
