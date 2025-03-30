const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function main(){
    const categories = ['Coffee','Non-Coffee','Foods'];

    for(const category of categories){
        await prisma.category.upsert({
            where : {
                name : category
            },
            update:{},
            create:{
                name : category
            }
        })
    }
    console.log('categoryy ditambahkan');
}
main()
.catch((e)=>{
    console.error(e);
    process.exit(1);
})
.finally(async()=>{
    await prisma.$disconnect();
})