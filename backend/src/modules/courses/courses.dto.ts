export class CourseDto {
  id!: string;
  code!: string;
  name!: string;
  description!: string | null;
}

export class CourseSupportOptionsDto {
  course!: CourseDto;
  products!: any[];
  tas!: any[];
  upcomingGroupSessions!: any[];
  activeStudentBundles!: any[];
}
