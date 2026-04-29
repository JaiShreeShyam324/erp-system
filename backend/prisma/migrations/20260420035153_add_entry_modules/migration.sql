-- CreateTable
CREATE TABLE "public"."uid_machine_entries" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "machineNumber" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uid_machine_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."barcode_check_entries" (
    "id" SERIAL NOT NULL,
    "barcode" TEXT NOT NULL,
    "checkingDate" TIMESTAMP(3) NOT NULL,
    "checkingRemark" TEXT,
    "checkerName" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barcode_check_entries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."uid_machine_entries" ADD CONSTRAINT "uid_machine_entries_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."barcode_check_entries" ADD CONSTRAINT "barcode_check_entries_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
