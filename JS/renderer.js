import  Developer from "./developer.js";

export default class Renderer{

    static renderDevelopers(developers, containerId){
        const container =document.getElementById(containerId);
        container.innerHTML="";

        developers.forEach(dev => {
            const devObj=new Developer(dev.id, dev.name, dev.email, dev.job, dev.age, dev.salary, dev.image);

            let cardClass="card mb-3";
            if(devObj.isOld()) cardClass+=" old-dev";
            else if (devObj.isYoung()) cardClass+=" young-dev";

            const cardHTML=`
                <div class="${cardClass}" style="width: 18rem;">
                    <img src="${devObj.image}" class="card-img-top" alt="${devObj.name}">
                    <div class="card-body">
                        <h5 class="card-title">${devObj.name}</h5>
                         <p class="card-text">
                            Email: ${devObj.email}<br>
                            Job: ${devObj.job}<br>
                            Age: ${devObj.age}<br>
                            Salary: ${devObj.salary}
                         </p>
                         <button class="btn btn-primary btn-sm update-btn" data-id="${devObj.id}">Update</button>
                         <button class="btn btn-danger btn-sm delete-btn" data-id="${devObj.id}">Delete</button>
                    </div>
                </div>
            `;
            container.innerHTML+=cardHTML;
        });
    }
}