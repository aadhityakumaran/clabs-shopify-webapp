-- CreateTable
CREATE TABLE "Pixel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountID" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
