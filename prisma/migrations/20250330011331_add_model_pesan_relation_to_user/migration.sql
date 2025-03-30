-- CreateTable
CREATE TABLE "Pesan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "guestName" TEXT,
    "guestPhone" TEXT,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pesan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pesan" ADD CONSTRAINT "Pesan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
