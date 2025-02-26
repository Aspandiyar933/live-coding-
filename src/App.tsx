import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  List,
  ListItem,
  Typography,
} from "@mui/material";

interface Subject {
  id: number;
  title: string;
  slug: string;
  is_miscellaneous_subject: boolean;
}

interface DigitalPass {
  id: number;
  title: string;
  level: number;
  category_id: number;
  category_title: string;
}

interface Course {
  id: number;
  title: string;
  subject: Subject;
  description: string;
  cover_image: string;
  level: number;
  level_id: number;
  average_rating: number;
  enrolls_count: number;
  units_count: number;
  digital_pass: DigitalPass;
  language: string;
  created_at: string;
  tags: string[];
}

interface ApiResponse {
  results: Course[];
}

async function fetchData(): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `https://edres.com/api/edu/v3/public/course/course/?page=1&language=en`
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const courseData = await fetchData();
        console.log(courseData);
        setCourses(courseData.results);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch course data"
        );
        setIsLoading(false);
      }
    };

    loadCourse();
  }, []);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <List
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
              }}
            >
              {courses.map((course) => (
                <ListItem key={course.id} sx={{ width: "auto", p: 0 }}>
                  <Card sx={{ maxWidth: 345, minWidth: 250 }}>
                    <CardMedia
                      component="img"
                      alt={course.title}
                      height="140"
                      image={course.cover_image}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {course.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {course.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Share</Button>
                      <Button size="small">Learn More</Button>
                    </CardActions>
                  </Card>
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
    </>
  );
}

export default App;
