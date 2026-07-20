import { createTagDtoSchema, tagDtoSchema } from "@yuno/shared-types";
import { apiRequest } from "@/lib/api-client";

export const tagsService = {
  list() {
    return apiRequest({
      path: "/tags",
      schema: tagDtoSchema.array(),
    });
  },

  create(input: unknown) {
    return apiRequest({
      path: "/tags",
      method: "POST",
      body: createTagDtoSchema.parse(input),
      schema: tagDtoSchema,
    });
  },
};
