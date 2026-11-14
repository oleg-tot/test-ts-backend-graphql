import { join } from 'node:path'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile:
        process.env.NODE_ENV === 'test'
          ? true
          : join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      graphiql: false,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
      context: () => ({}),
    }),
  ],
})
export class GraphqlModule {}
