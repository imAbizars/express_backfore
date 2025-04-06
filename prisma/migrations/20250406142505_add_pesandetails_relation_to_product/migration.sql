-- CreateTable
CREATE TABLE "PesanDetail" (
    "id" SERIAL NOT NULL,
    "pesanId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PesanDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PesanDetail" ADD CONSTRAINT "PesanDetail_pesanId_fkey" FOREIGN KEY ("pesanId") REFERENCES "Pesan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesanDetail" ADD CONSTRAINT "PesanDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
