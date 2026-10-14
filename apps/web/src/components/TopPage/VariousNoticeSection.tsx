
const NoticeSectionCard = ({title}: {title: string}) => {
    return (
        <div>
            <h2>{title}</h2>
        </div>
    )
}
export default function VariousNoticeSection() {
    return (
     <div>
         <NoticeSectionCard title="献血"/>
         <NoticeSectionCard title={"フリーWi-Fi"}/>
         <NoticeSectionCard title={"注意事項"}/>
         
         
     </div>   
    )
}
