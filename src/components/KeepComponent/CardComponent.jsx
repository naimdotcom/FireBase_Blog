import { Card, CardContent, CardDescription, CardTitle } from "keep-react";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";

export const CardComponent = ({ data }) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/blog/${data.creator}/${data?.id}`);
  };

  const content = (limit = 50) => {
    return parse(data?.content ? data?.content : "");
  };

  return (
    <Card
      className="max-w-md bg-slate-50 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="space-y-4">
        <CardTitle>{data?.title}</CardTitle>
        <CardDescription className=" bg-slate-200 px-2 py-2 rounded-md ">
          <h3 className="line-clamp-2">{content()}</h3>
        </CardDescription>
      </CardContent>
    </Card>
  );
};
