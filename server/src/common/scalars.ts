import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { GraphQLError } from 'graphql';

@Scalar('DateTime', () => Date)
export class DateTimeScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  parseValue(value: string): Date {
    return new Date(value);
  }

  serialize(value: Date): string {
    return value.toISOString();
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new GraphQLError('Can only parse strings to dates');
  }
}

@Scalar('Decimal', () => String)
export class DecimalScalar implements CustomScalar<string, string> {
  description = 'Decimal custom scalar type';

  parseValue(value: string): string {
    return value;
  }

  serialize(value: any): string {
    return value.toString();
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
      return ast.value;
    }
    throw new GraphQLError('Can only parse strings/numbers to decimals');
  }
}
