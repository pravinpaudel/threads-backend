import express from 'express';
import createApolloGraphqlServer  from './graphql/graphql';
import { expressMiddleware } from '@apollo/server/express4';

async function startServer() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());
    
    app.use('/graphql', expressMiddleware(await createApolloGraphqlServer()));

    app.get('/', (req, res) => {
        res.json('Hello World!');
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer().catch((error) => {
    console.error('Error starting server:', error);
});
