document.querySelector("#addnewProject").addEventListener('click',()=>ProjectDOMManipulation.showProjectForm())
document.querySelector('.addtodo').addEventListener('click',()=>{ProjectDOMManipulation.cloneToDo()})
document.querySelector('#submitedit').addEventListener('click',()=>{document.querySelector('.edittoggle').classList.toggle("edittoggleOpacity")})

let Projects = {
    ProjectONE: {}
}

window.onload = () =>{
    let parsed = JSON.parse(localStorage.getItem('myObject'));
    if(parsed === null){
        Projects = { ProjectONE: {}}
        ProjectManegmnet.projectsOnLoad();
    }else{
        Projects = parsed
        ProjectManegmnet.projectsOnLoad();
    }
    ProjectManegmnet.currentProject  = document.querySelector('.projects').firstElementChild.firstElementChild.textContent;
    if(ProjectManegmnet.currentProject === ""){
        console.log('ProjectManegmnet.currentProject is empty for some reason')
    }else{
    ProjectManegmnet.currentProject  = document.querySelector('.projects').firstElementChild.firstElementChild.textContent;
    ProjectManegmnet.goOverProjects();
    }
} 

const ProjectManegmnet = {

    currentProject: "ProjectONE",
    updateProjectObject: function(){
        let myObj  = JSON.stringify(Projects);
        localStorage.setItem("myObject",myObj);
    },
    checkProjectName: function(name){
        name = name.toLowerCase()

        let Projectsarr = Object.keys(Projects);
        Projectsarr = Projectsarr.map(project=>{
            return project.toLowerCase();
        })

        if(Projectsarr.includes(`${name}`)){
            return false
        }
        else{
            return true
        }
    },

    addProject: function(name){
        Projects[name]={}
        this.goOverProjects();
        ProjectManegmnet.updateProjectObject();
    },

    addToDo: function(datasettodo){
        let z = `todo${datasettodo}`
        Projects[this.currentProject][z]={}
        Projects[this.currentProject][z].title = ""
        Projects[this.currentProject][z].description = ""
        Projects[this.currentProject][z].duedate = ""
        Projects[this.currentProject][z].priority = ""
        Projects[this.currentProject][z].notes = ""
        Projects[this.currentProject][z].dataset = datasettodo
        ProjectManegmnet.updateProjectObject();
    },

    removeToDo: function(datasetid){
        let z = `todo${datasetid}`
        delete Projects[ProjectManegmnet.currentProject][z];
        ProjectManegmnet.updateProjectObject();
    },

    removeProject: function(projectname){
        delete Projects[projectname]
        ProjectManegmnet.updateProjectObject();
    },

    goOverProjects: function(){
        document.querySelectorAll('.todoClone').forEach(tab=>tab.remove())
        Object.values(Projects[this.currentProject]).forEach(value =>{
            ProjectDOMManipulation.addNodesFromProjectsArray(value.title,value.description,value.duedate, value.notes,value.priority,value.dataset)
        })

    },

    projectsOnLoad: function(){
        Object.keys(Projects).forEach(project =>{
            ProjectDOMManipulation.addProjectFromArray(project);
        })
    },

    editToDo: function(dataset){

            title = document.querySelector('#edittitle').value;
            description = document.querySelector('#editdescription').value;
            duedate = document.querySelector('#editduedate').value;
            priority = document.getElementById('editpriority');
            priorityvalue = priority.options[priority.selectedIndex].value;
            priority = document.querySelector('#editnotes').value;
            x='todo'+dataset

            thistodo = Projects[this.currentProject][x]

            thistodo.title = title;
            thistodo.description = description;
            thistodo.duedate = duedate;
            thistodo.priority = priority;
            thistodo.priority = priority;

            ProjectManegmnet.updateProjectObject();
    },
}


const ProjectDOMManipulation = {

    showProjectForm: function(){
        document.querySelector('.input_error').textContent = ""
        document.querySelector('.addProjectToggle').classList.toggle('addProjectToggleopa')

        document.querySelector('#projectnamesubmit').addEventListener('click',()=>{
            let projectName = document.querySelector('#projectnameinput').value

        if(ProjectManegmnet.checkProjectName(projectName)==true){
            ProjectManegmnet.currentProject = projectName;
            ProjectManegmnet.addProject(projectName);
            ProjectDOMManipulation.addProject(projectName);
            document.querySelector('.addProjectToggle').classList.add('addProjectToggleopa')
            //ProjectManegmnet.goOverProjects()
        }else{
            this.Error("This project name is already taken",'.input_error')
        }
    })
    },

    Error: function(string,selector){
        document.querySelector(selector).textContent = string
    },

    addProjectFromArray: function(project){
        let projectsdiv = document.querySelector('.projects');
        let prparent = document.querySelector('.prparent');
        let newDiv = prparent.cloneNode(true);

        newDiv.classList.remove('prparent');
        newDiv.dataset.projectname = project;
        newDiv.addEventListener('click',()=>{ProjectManegmnet.currentProject = project; ProjectManegmnet.goOverProjects();this.selectedProject()});

        let newp = document.createElement('p');
        newp.dataset.Pprojectname = project;
        newp.textContent = project;
        newDiv.textContent = ""
        newDiv.appendChild(newp);

        let delbtn = document.createElement('button');
        delbtn.classList.add('delBtn','fa-solid','fa-xmark')
        delbtn.addEventListener('click',(event)=>{
            ProjectManegmnet.removeProject(newDiv.dataset.projectname);
            newDiv.remove();
            event.stopPropagation();
        })
        newDiv.appendChild(delbtn)

        projectsdiv.insertBefore(newDiv,document.querySelector('.addnewProject'))
    },

    addProject: function(dataset){
        let projectsdiv = document.querySelector('.projects');
        let prparent = document.querySelector('.prparent');
        let newDiv = prparent.cloneNode(true);

        newDiv.classList.remove('prparent');
        newDiv.dataset.projectname = dataset;
        

        newDiv.addEventListener('click',()=>{ProjectManegmnet.currentProject = dataset; ProjectManegmnet.goOverProjects();this.selectedProject()});

        projectName = document.querySelector('#projectnameinput').value;
        let newp = document.createElement('p');
        newp.dataset.Pprojectname = projectName;
        newp.textContent = projectName;
        newDiv.textContent = ""

        newDiv.appendChild(newp);


        let delbtn = document.createElement('button');
        delbtn.textContent = "X"
        delbtn.classList.add('delBtn')
        delbtn.addEventListener('click',(event)=>{
            ProjectManegmnet.removeProject(newDiv.dataset.projectname);
            newDiv.remove();
            ProjectManegmnet.currentProject = document.querySelector('.projects').firstElementChild.firstElementChild.textContent;
            ProjectManegmnet.goOverProjects()
            event.stopPropagation();
        })
        newDiv.appendChild(delbtn)

        projectsdiv.insertBefore(newDiv,document.querySelector('.addnewProject'))
    },


    cloneToDo: function(){
        let todo = document.querySelector('.todoinvisible');
        let newtodo = todo.cloneNode(true);
        newtodo.classList.remove('todoinvisible')
        newtodo.classList.add('todoClone');
        
        len = Object.keys(Projects[ProjectManegmnet.currentProject]).length
        newtodo.dataset.todoid = `${ProjectManegmnet.currentProject}-${len}`;
        let datasettodo = newtodo.dataset.todoid
        newtodo.querySelector('#edit').dataset.todo = datasettodo
        ProjectManegmnet.addToDo(datasettodo);

        newtodo.querySelector('#delete').addEventListener('click',()=>{newtodo.remove(); ProjectManegmnet.removeToDo(datasettodo)});
        newtodo.querySelector('#edit').addEventListener('click',(e)=>{

            document.querySelector('.edittoggle').classList.toggle("edittoggleOpacity");
                document.querySelector('#submitedit').addEventListener('click',()=>{
                    ProjectManegmnet.editToDo(datasettodo);
                    this.editToDo(e)
                },{once:true})

        });
        
        document.querySelector('.todotab').insertBefore(newtodo,document.querySelector('.last'))

    },

    editToDo: function(e){

        datasettodo = e.target.dataset.todo
        title = document.querySelector('#edittitle').value;
        description = document.querySelector('#editdescription').value;
        duedate = document.querySelector('#editduedate').value;
        priority = document.getElementById('editpriority');
        priorityvalue = priority.options[priority.selectedIndex].value;
        notes = document.querySelector('#editnotes').value;

        thisToDo = document.querySelector(`[data-todoid="${datasettodo}"]`);

        thisToDo.querySelector('#title').textContent = title;
        thisToDo.querySelector('#description').textContent = description;
        thisToDo.querySelector('#duedate').textContent = duedate;
        thisToDo.querySelector('#priority').textContent = priorityvalue;
        thisToDo.querySelector('#notes').textContent = notes;
    },

    editToDo2: function(datasettodo){

        title = document.querySelector('#edittitle').value;
        description = document.querySelector('#editdescription').value;
        duedate = document.querySelector('#editduedate').value;
        priority = document.getElementById('editpriority');
        priorityvalue = priority.options[priority.selectedIndex].value;
        notes = document.querySelector('#editnotes').value;

        thisToDo = document.querySelector(`[data-todoid="${datasettodo}"]`);

        thisToDo.querySelector('#title').textContent = title;
        thisToDo.querySelector('#description').textContent = description;
        thisToDo.querySelector('#duedate').textContent = duedate;
        thisToDo.querySelector('#priority').textContent = priorityvalue;
        thisToDo.querySelector('#notes').textContent = notes;
    },

    addNodesFromProjectsArray: function(title,description,duedate,notes,priority,dataset){
        let todo = document.querySelector('.todoinvisible')
        let newtodo = todo.cloneNode(true);
        newtodo.classList.add('todoClone');

        newtodo.classList.remove('todoinvisible')
        newtodo.querySelector('#title').textContent = title;
        newtodo.querySelector('#description').textContent = description;
        newtodo.querySelector('#duedate').textContent = duedate;
        newtodo.querySelector('#priority').textContent = priority;
        newtodo.querySelector('#notes').textContent = notes;
        
        newtodo.dataset.todoid = dataset
        newtodo.querySelector('#delete').addEventListener('click',()=>{newtodo.remove(); ProjectManegmnet.removeToDo(dataset)});

        newtodo.querySelector('#edit').addEventListener('click',()=>{
            document.querySelector('.edittoggle').classList.toggle("edittoggleOpacity");
                document.querySelector('#submitedit').addEventListener('click',()=>{
                    ProjectManegmnet.editToDo(dataset);
                    this.editToDo2(dataset)
                },{once:true})

        });

        document.querySelector('.todotab').insertBefore(newtodo,document.querySelector('.last'))
    },

    editEventListener: function(dataset){
        document.querySelector('.edittoggle').classList.toggle("edittoggleOpacity");
        document.querySelector('#submitedit').addEventListener('click',()=>{
            ProjectManegmnet.editToDo(dataset);
        })
    },

    selectedProject: function(){
        document.querySelectorAll('.projectname').forEach(elem=>{
            elem.style = "background-color:rgba(0, 0, 0, 0.1);bottom: 0;"
        })

        selectedProject = document.querySelector(`[data-projectname="${ProjectManegmnet.currentProject}"]`)
        selectedProject.style = "background-color:rgba(0, 0, 0, 0.5); bottom: 10px;"
    },
}