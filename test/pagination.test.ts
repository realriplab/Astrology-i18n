import assert from "node:assert/strict"
import test from "node:test"

import { getVisiblePaginationItems } from "../src/utils/pagination.ts"

test("shows the first three pages, an ellipsis, and the last page near the start", () => {
  assert.deepEqual(getVisiblePaginationItems(1, 15), [1, 2, 3, "ellipsis", 15])
  assert.deepEqual(getVisiblePaginationItems(3, 15), [1, 2, 3, 4, "ellipsis", 15])
})
