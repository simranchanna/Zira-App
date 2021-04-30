let tc = $(".ticket-container");
let allTasks = localStorage.getItem("allTasks");
let modalVisible = false;
let selectedPriority;

if(allTasks != null)
    allTasks = JSON.parse(allTasks);  

$(".add").click(showModal); 
$(".delete").click(deleteTask);   
$(".filter").click(filterHandler);

function display(allTasks){
    tc.empty();
    if(allTasks != null){
        for(let Task of allTasks){
            let ticket = $("<div></div>").addClass("ticket");
            ticket.html(`<div class="ticket-color ${Task.priority}"></div>
                         <div class="ticket-id">#${Task.id}</div>
                         <div class="task">${Task.task}</div>`);
            tc.append(ticket);   
            ticket.click(function() {
                $(this).toggleClass("active");
            });          
        }
    }
}

function showModal(){
    if(!modalVisible){
        let modal = $("<div></div>").addClass("modal");
        modal.css("display", "none");
        modal.html(`<div class="task-to-be-added" data-typed="false" contenteditable>Enter your task here</div>
                    <div class="priority-list">
                        <div class="pink modal-filter"></div>
                        <div class="red modal-filter"></div>
                        <div class="yellow modal-filter"></div>
                        <div class="green modal-filter"></div>
                    </div>`);
        tc.append(modal);
        modal.slideDown("slow");       
        modalVisible = true;     
        $(".task-to-be-added").click(function(){
            if($(this).attr("data-typed") == "false"){
                $(this).empty();
                $(this).attr("data-typed", "true");
            }
        });
        $(".task-to-be-added").keypress(addTicket);
        selectedPriority = "pink";
        $(".modal-filter").click(selectPriority);
    }
}

function addTicket(e){
    if(e.key == "Enter" && e.shiftKey == false){
        if($(this).text().trim() != ""){
            let task = $(this).text();
            let uid = new ShortUniqueId();
            let id = uid();   
            //adding in local storage
            if(allTasks == null){  //if there is no ticket in storage
                let data = [{"id":id, "task": task, "priority": selectedPriority}];
                localStorage.setItem("allTasks", JSON.stringify(data));
            }     
            else{
                allTasks.push({"id":id, "task": task, "priority": selectedPriority});
                localStorage.setItem("allTasks", JSON.stringify(allTasks));
            }  
            $(".selected-color").removeClass("selected-color");
            display(allTasks);
        } else{
            e.preventDefault();
            alert("Error! Please enter your task");
        }
    }
}

function selectPriority(e){
    $(".modal-filter.active").removeClass("active");
    $(this).toggleClass("active");
    selectedPriority = e.currentTarget.classList[0];
    $(".task-to-be-added").click().focus();
}

function deleteTask(){
    let ids = $(".active .ticket-id");
    for(let i = 0; i < ids.length; i++){
        allTasks = allTasks.filter((data) => {
            return ids[i].innerText != "#" + data.id;
        });
    }
    $(".active").remove();
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

function filterHandler(e) {
    $(".selected-color").removeClass("selected-color");
    $(this).addClass("selected-color");
    let color = e.currentTarget.classList[1].split("-")[0];
    let selectedTasks = allTasks.filter((data) => {
        return data.priority == color;
    });
    display(selectedTasks);
}

display(allTasks);
