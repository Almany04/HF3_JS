import { jsx } from "react/jsx-runtime";

const BASE_URL= "https://api.siposm.hu/developers";

export default class APIHandler{

    // READ 
    static async getAllDevelopers(){
        const response=await fetch(BASE_URL);
        return await response.json();
    }

    // CREATE

    static async createDeveloper(developerObj){
        const response=await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(developerObj)
        });
        return await response.json();
    }

    // UPDATE

    static async updateDeveloper(id, updateObj){
        const response=await fetch(`${BASE_URL}/${id}`,{
            method: "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(updateObj)
        });
        return await response.json();
    }

    // DELETE

    static async deleteDeveloper(id){
        const response=await fetch(`${BASE_URL}/${id}`,{
            method: "DELETE"
        });
        return await response.json();
    }
}