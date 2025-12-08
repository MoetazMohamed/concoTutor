export class CourseDto {
  id!: string;
  code!: string;
  name!: string;
  description!: string | null;
}

export class CreateCourseDto {
  code!: string;
  name!: string;
  description?: string;
}

export class CreateCourseByTutorDto {
  code!: string;
  name!: string;
  description?: string;
  taId!: string;
}

export class CourseSupportOptionsDto {
  course!: CourseDto;
  products!: any[];
  tas!: any[];
  upcomingGroupSessions!: any[];
  activeStudentBundles!: any[];
  availability!: any[];
}
