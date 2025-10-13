export default class Developer{
    constructor(id, name, email, job, age, salary, image){
        this.id=id;
        this.name=name;
        this.email=email;
        this.job=job;
        this.age=age;
        this.salary=salary;
        this.image=image;
    }

    isOld(){
        return this.age>45;
    }

    isYoung(){
        return this.age<=25;
    }
}