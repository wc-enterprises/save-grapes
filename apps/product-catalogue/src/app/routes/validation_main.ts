export const mandatoryParamCheck = (data)=>{

    const missingparams = []
    const mandatoryParam = [
        'merchantId',
        'productCatalogueId',
        'price',
        'tax',
    ]
    mandatoryParam.forEach((val)=>{
        const incomingKeys = Object.keys(data)
        if(!incomingKeys.includes(val)){
            missingparams.push(val)
        }
    })
    if (missingparams.length){
        throw new Error (`Mandatory params missing. ${missingparams.join(',')}`)
    }

}
export const merchantId = (id)=>{
    if(typeof id!=='string')
        throw new Error(`Invalid merchantId type`)
}
export const productCatalogueId = (productCatalogueId)=>{
    if(typeof productCatalogueId!=='string')
        throw new Error (`Invalid productCatalogueId type`)
}

export const tax = (tax)=>{
    if(typeof tax!=='number')
        throw new Error(`Invalid tax type`)
    if(tax < 0)
        throw new Error(`Tax should be positive value`)
}

export const price = (price)=>{
    if(typeof price !=='number')
        throw new Error(`Invalid price type`)
    if(price < 0)
        throw new Error(`Price should be  positive value.`)
}

export const description = (description)=>{
    if(typeof description!=='string')
        throw new Error(`Invalid description type`)
    if(description.length > 200)
        throw new Error(`Description length should be less than 200 characters.`)
}

export const brand = (brand)=>{
    if(typeof brand !=='string')
        throw new Error(`Invalid brand type`)
    if(brand.length <3 || brand.length >30)
        throw new Error(`Brand length should be between 3 and 30 characters.`)
}

export const discount  = (discount)=>{
    if(typeof discount !=='number')
        throw new Error(`Invalid discount type`)
}

export const name = (name)=>{
    if(typeof name!=='string')
        throw new Error(`Invalid type name`)
    if(name.length<3 || name.length > 100)
        throw new Error(`Name length should be between 3 and 100 characters.`)
}


const validation ={
    mandatoryParamCheck,
    merchantId,
    productCatalogueId,
    tax,
    price,
    description,
    brand,
    discount,
    name,
};
export default validation