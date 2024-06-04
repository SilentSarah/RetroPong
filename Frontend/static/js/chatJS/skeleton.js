

function chatFriendSkeleton () {
    return `
    <div class="RectangleSK Rectangle h-10 position-relative w-100" style="backgroundColor:gray">
        <div class="RimgSK Rimg Cimg position-absolute rounded-circle" src="" alt="avatar"></div>
        <div class="onlineSK online rounded-circle position-absolute"></div>
        </div>
        <div class="CinformationSK Cinformation text-white d-flex flex-column w-90 h-30 p-3 gap-3">
        <div class="CitemInfoSK CitemInfo d-flex flex-column"> 
            <span class="CnameSK Cname Cbreak fw-bold"> </span>
            <span class="CdescriptionSK Cdescription Cbreak"> </span>
        </div>
        <div class="CitemInfoSK CitemInfo d-flex flex-column"> 
            <span class="detailsFriend SKdetailsFriend Cbreak"> </span>
            <span class="detailsFriend Cbreak"></span>
        </div>
    </div>`
}

function contentMessageSkeleton(){
    return `<div class="CcontentMessageSK CcontentMessage d-flex align-items-end position-relative" >
                <div class="d-flex gap-3 w-100 align-items-center">
                   <div class="CcimgSK Ccimg rounded-circle w-10"></div>
                   <div class="w-80 gap-2 d-flex flex-column">
                        <div class="infoSK Cmessage bg-pink "> </div>
                        <div class="CmessageSK Cmessage bg-pink "> </div>
                   </div>
                </div>
                <span class="timeChatSK timeChat position-absolute"> ferf<span class="timeSize fw-normal">fer </span></span>
            </div>
            `
}

const FriendsSkeleton = () => {
    return `<div class="RuserSK w-100 py-2 px-2 mb-2 d-flex align-items-center justify-content-between">
                <div class="RcontentSK Rcontent d-flex align-items-center gap-2">
                    <div class="RimageSK Rimg img-fr rounded-circle" ></div>
                    <div class="d-flex flex-column gap-2">
                        <span class="nameSK name text-white fw-bold fs-5"></span>
                        <span class="descriptionSK description text-secondary"></span> 
                    </div>
                </div> 
                <div class="d-flex align-items-center gap-2">
                    <div id="rb-0"  class="RbtnsSK Rbtns" ></div>
                    <div id="rb-1" class="RbtnsSK Rbtns "  ></div>
                    <div id="rb-2"  class="RbtnsSK Rbtns "  ></div>
                    <div id="rb-3"  class="RbtnsSK Rbtns " ></div>
                 </div>
            </div>`
}

const CardsSkeleton = () => {
    return `
            <div class="RcardSK Rcard d-flex flex-column p-4 gap-2">
                <div class="d-flex align-items-center gap-2">
                    <div class="RcardImgSK RcardImg w-30 rounded-circle" ></div>
                    <div class="d-flex flex-column gap-2">
                        <span class="nameSK text-white fw-bold fs-5"></span>
                        <span class="descriptionSK text-secondary"></span>
                    </div>
                </div>
                <div class="h-100 w-100 d-flex align-items-end justify-content-center">
                    <button   class="btn_inviteSK btn_invite text-white"></button>
                </div>
            </div>`
}


function SkeletonCards(){
    const Rcards = document.getElementById('Rcards')

    Rcards.innerHTML = ""
    for (let i = 0; i < 3; i++)
        Rcards.innerHTML += CardsSkeleton()

}

function SkeletonFriends(){
    const resUsers = document.getElementById('resUsers')

    resUsers.innerHTML = ""
        for (let i = 0; i < 7; i++) {
            resUsers.innerHTML += FriendsSkeleton();
        }
}

function handleError()
{
    const resUsers = document.getElementById('resUsers')
    const Rcards = document.getElementById('Rcards')

    Rcards.innerHTML = `<h4 class="text-secondary">Failed connection!</h4>`
    resUsers.innerHTML = `<h4 class="text-white d-flex justify-content-center">Failed connection!</h4>`
}