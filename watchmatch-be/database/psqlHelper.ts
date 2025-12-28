import type { QueryResult } from "pg";
import type z from "zod";

// PSQL Query handling
function handleSinglePSQLQueryOutput<T>(input: {
  result: QueryResult<any>;
  zodvalidator: z.ZodType<T>;
  datatype?: string; // Used for logging
}): T | null {
  if (input.result.rows.length === 0) {
    console.log(`${input.datatype ?? "Value"} not found`);
    return null;
  } else if (input.result.rows.length > 1) {
    console.warn(
      `Multiple ${input.datatype ?? "Value"} found with the same link id`
    );
    throw Error;
  }

  const parsed = input.zodvalidator.safeParse(input.result.rows[0]);
  if (!parsed.success) {
    console.error(
      `${input.datatype ?? "Value"} from database failed validation: `,
      parsed.error
    );
    return null;
  }
  const validatedSingleQueryOutput = parsed.data;

  return validatedSingleQueryOutput;
}

// PSQL Query handling
function handleMultiplePSQLQueryOutput<T>(input: {
  result: QueryResult<any>;
  zodvalidator: z.ZodType<T>;
  datatype?: string; // Used for logging
}): T | null {
  if (input.result.rows.length === 0) {
    console.log(`${input.datatype ?? "Value"} not found`);
    return null;
  }

  const parsed = input.zodvalidator.safeParse(input.result.rows);
  if (!parsed.success) {
    console.error(
      `${input.datatype ?? "Value"} from database failed validation: `,
      parsed.error
    );
    return null;
  }
  const validatedSingleQueryOutput = parsed.data;

  return validatedSingleQueryOutput;
}

export default {
  handleSinglePSQLQueryOutput,
  handleMultiplePSQLQueryOutput,
};
