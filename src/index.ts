import express from 'express';
import createApolloGraphqlServer  from './graphql/graphql';
import { expressMiddleware } from '@apollo/server/express4';
import { UserService } from './service/userService';

async function startServer() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());
    
    // All the requests go through context middleware once. Context is a function that returns an object. The object is passed to the resolvers.
    // The context function is called for every request. It can be used to pass data to the resolvers.
    // The context function can also be used to authenticate the user. The context function is called for every request. It can be used to pass data to the resolvers.
    app.use('/graphql', expressMiddleware(await createApolloGraphqlServer(), {
        context: async ( { req, res }) => {
            const token = req.headers.authorization || '';
            if (token) {
                try {
                    // Assuming the token is in the format "Bearer <token>"
                    // Returns the user payload if the token is valid
                    const user = UserService.decodeToken(token);
                    
                    // It'll attach the user as a property to the context object
                    return { user };
                } catch (error) {
                    console.error('Invalid token:', error);
                    return { user: null };
                }
            }
            return { user: null };
        }
    }));

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
