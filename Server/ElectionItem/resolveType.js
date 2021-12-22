const __resolveType = (obj, context, info) => {
     switch(obj.type) {
        case "Candidate":
            return "Candidate";
        case "Amendment":
            return "Amendment";
        case "Item":
            return "Item";
     }
     return null;
}

export default __resolveType;