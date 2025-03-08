export default function NewsElement(title: string, content :string){
    return(
        <div className={"box"}>
            <h1 className={"title"}> {title}</h1>
            <p> {content}</p>
        </div>
    )
}