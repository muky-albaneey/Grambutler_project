/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, ForgotPass } from './dto/create-user.dto';
import { DataSource, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { OnboardingDto, SettingDto } from './dto/update-user.dto';
import { Onboarding } from './entities/onoard.entity';
import * as path from 'path';
import { ProfileImage } from './entities/profile.entity';
import { Settings } from './entities/setting.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Category } from './entities/category.entity';
import { PostImage } from './entities/post-image.entity';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,
    
    // @InjectRepository(MailService)
    private readonly emailservice: MailService,

    @InjectRepository(ProfileImage)
    private readonly ProfileBgRepository: Repository<ProfileImage>,

    @InjectRepository(Settings)
    private readonly SettingsRepository: Repository<Settings>,
    
    @InjectRepository(Post)
    @InjectRepository(Post) private postRepository: Repository<Post>,

    
    @InjectRepository(Comment)
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,

    
    @InjectRepository(Like)
    @InjectRepository(Like) private likeRepository: Repository<Like>,


    @InjectRepository(Category)
    @InjectRepository(Category) private categoryRepository: Repository<Category>,

    @InjectRepository(PostImage)
    @InjectRepository(PostImage) private postImageRepository: Repository<PostImage>,


    
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async create(createAuthDto: CreateAuthDto): Promise<any> {
    try {
      const userValidate = await this.userRepository.findOne({
        where: { email: createAuthDto.email },
      });

      if (userValidate) {
        throw new UnauthorizedException('The user already exists!');
      }

      // Hash the password before saving
      createAuthDto.password = await this.hashPassword(createAuthDto.password);

      const newUser = await this.userRepository.create(createAuthDto);
      const userSaved = await this.userRepository.save(newUser);

      return { user: userSaved };
    } catch (error) {
      console.error('User creation failed', error);
      console.error('User creation failed', error);
      throw error;
    }
  }

  async login(createAuthDto: CreateAuthDto): Promise<any> {
    try {
      const userValidate = await this.userRepository.findOne({
        where: { email: createAuthDto.email },
      });

      if (!userValidate) {
        throw new UnauthorizedException('The user does not exist!');
      }

      const isMatch = await bcrypt.compare(createAuthDto.password, userValidate.password);
      if (!isMatch) {
        throw new UnauthorizedException('The password does not match!');
      }

      return userValidate;
    } catch (error) {
      console.error('User login failed', error);
      throw error;
    }
  }

  // FORGOT PASSWORD SECTION
  async getTokens(userEmail: ForgotPass) {
    const userValidate = await this.userRepository.findOne({
      where: { email: userEmail.email },
    });

    if (!userValidate) {
      throw new UnauthorizedException('The email address does not exist!');
    }

    const token = Math.floor(10000 + Math.random() * 90000).toString();

    userValidate.rememberToken = token;
    await this.userRepository.save(userValidate);

    await this.emailservice.dispatchEmail(
      userValidate.email,
      'FORGOT PASSWORD TOKEN',
      `
      this token will be expired imediately you changed your password
      password reset token: ${token} `,
      `<h1>${userValidate.rememberToken}</h1>`
    );

    return `Message has been sent to your email, ${userValidate.full_name}`;
  }

  async validateTokens(tokenNum: string): Promise<string> {
    const userValidate = await this.userRepository.findOne({
      where: { rememberToken: tokenNum },
    });

    if (!userValidate) {
      throw new UnauthorizedException('The tokens are incorrect!');
    }

    return userValidate.rememberToken;
  }

  async changePassword(tokenNum: string, newPassword: string) {
    console.log('Changing password for token:', tokenNum);

    const userValidate = await this.userRepository.findOne({
      where: { rememberToken: tokenNum },
    });

    if (!userValidate || tokenNum == undefined || tokenNum == null || tokenNum == '') {
      throw new UnauthorizedException('The tokens are incorrect!');
    }

    console.log('User found for password change:', userValidate);

    userValidate.password = await this.hashPassword(newPassword);
    userValidate.rememberToken = ''; // Clear token after successful password change
    await this.userRepository.save(userValidate);

    console.log('Password changed and token cleared for user:', userValidate);
    return userValidate;
  }


  async updateOnboarding(id, body: OnboardingDto) {
    // Find the user with the given id and their associated onboarding information
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {onboard_info: true, profile_image: true, settings: true, caption_responses: true, prompt_responses:true}  
    });
  
    console.log("User found: ", user);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (user.onboard_info) {
      // Update existing onboarding entity
      user.onboard_info.marketing_objectives = body.marketing_objectives;
      user.onboard_info.target_audience = body.target_audience;
      user.onboard_info.campaigns = body.campaigns;
      user.onboard_info.social_media_business = body.social_media_business;
      user.onboard_info.info_caption = body.info_caption;
      user.onboard_info.marketing_challenges = body.marketing_challenges;
      user.onboard_info.marketing_or_sales = body.marketing_or_sales;
      user.onboard_info.members_dashoard = body.members_dashoard;
      user.onboard_info.current_workflow = body.current_workflow;
      user.onboard_info.type_of_support = body.type_of_support;
      user.onboard_info.recommend_dashboard = body.recommend_dashboard;
      user.onboard_info.immediate_questions = body.immediate_questions;
      user.onboard_info.personalized_training = body.personalized_training;
      user.onboard_info.about_new_features = body.about_new_features;
      user.onboard_info.contact_information = body.contact_information;
  
      console.log("Updating existing onboarding info: ", user.onboard_info);
      await this.onboardingRepository.save(user.onboard_info);
    } else {
      // Create new onboarding entity
      const newonboarding = this.onboardingRepository.create(body);
  
      console.log("Creating new onboarding info: ", newonboarding);
      user.onboard_info = await this.onboardingRepository.save(newonboarding);
    }
  
    // Save the updated user entity with new or updated onboarding info
    
    console.log("User updated successfully: ", user);
    return await this.userRepository.save(user);
  }

  async updateSetting(id, body: SettingDto) {
    // Find the user with the given id and their associated onboarding information
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {onboard_info: true, profile_image: true, settings: true, caption_responses: true, prompt_responses:true}  
     });
  
    console.log("User found: ", user);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (user.settings) {
      console.log(user.settings.firstname );
      
      // Update existing onboarding entity
      if(body.firstname !== "") user.settings.firstname = body?.firstname 
      else user.settings.firstname = user.settings.firstname;

      if(body.lastname !== "") user.settings.lastname = body?.lastname
      else user.settings.lastname = user.settings.lastname;

      if(body.email !== "") user.settings.email = body?.email;
      else user.settings.email = user.settings.email;

      if(body.username !== "") user.settings.username = body?.username;
      else user.settings.username  = user.settings.username;

      if(body.location !== "") user.settings.location = body?.location;
      else user.settings.location = user.settings.location;
      
      console.log("Updating existing profile info: ", user.settings);
      await this.SettingsRepository.save(user.settings);
    } else {
      // Create new onboarding entity
      const newsettings = this.SettingsRepository.create(body);
  
      console.log("Creating new onboarding info: ", newsettings);
      user.settings = await this.SettingsRepository.save(newsettings);
    }
  
    // Save the updated user entity with new or updated onboarding info
    
    console.log("User updated successfully: ", user);
    return await this.userRepository.save(user);
  }
  async findOne(id) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'onboard_info',
        'profile_image',
        'settings',
        'caption_responses',
        'prompt_responses',
        'following',
        'following.posts',
        'following.posts.comments',
        'following.posts.likes',
        'following.posts.post_image',
        'followers',
        'posts',
        'posts.comments',
        'posts.likes',
        'posts.post_image',
        'tasks'
      ],
      select: {
        // Select user fields
        id: true,
        full_name: true,
        email: true,
        role:true,
        // Optionally include other user-related fields...
  
        // Include posts with specific fields
        posts: {
          id: true,
          title: true,
          content: true,
          // Include category information
          category: {
            id: true,
            name: true,
          },
          post_image: {
            id: true,
            name: true,
            base64: true,
            ext: true,
          },
          comments: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              id: true,
              full_name: true,
            },
          },
        },
        // Add other relations as needed...
      },
    });
  
    console.log("User found: ", user);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return user;
  }

  async findAll() {
    const users = await this.userRepository.find({
      relations: [
        'onboard_info',
        'profile_image',
        'settings',
        'caption_responses',
        'prompt_responses',
        'following',
        'following.posts',
        'following.posts.comments',
        'following.posts.likes',
        'following.posts.post_image',
        'followers',
        'posts',
        'posts.comments',
        'posts.likes',
        'posts.post_image',
        'tasks'
      ],
      select: {
        // Select user fields
        id: true,
        full_name: true,
        email: true,
        role:true,
        // Optionally include other user-related fields...
  
        // Include posts with specific fields
        posts: {
          id: true,
          title: true,
          content: true,
          // Include category information
          category: {
            id: true,
            name: true,
          },
          post_image: {
            id: true,
            name: true,
            base64: true,
            ext: true,
          },
          comments: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              id: true,
              full_name: true,
            },
          },
        },
        // Add other relations as needed...
      },
    });
  
    return users;
  }
  
  
  async updateProfileBg(id, image: { originalname: string, buffer: Buffer }): Promise<User> {
    // Check if the user exists    
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {onboard_info: true, profile_image: true, settings: true, caption_responses: true, prompt_responses:true}  
      // relations: {profile_bg: true, profile_image : true},
    });
    
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Validate image file format
    if (!['.jpeg', '.png', '.gif', '.jpg', '.avif'].includes(path.extname(image.originalname).toLowerCase())) {
      throw new BadRequestException('Invalid image file format');
    }
  
    if (user.profile_image) {
      // Update existing profile background entity
      user.profile_image.name = image.originalname;
      user.profile_image.content = image.buffer;
      user.profile_image.ext = path.extname(image.originalname).toLowerCase().slice(1).trim();
      user.profile_image.base64 = image.buffer.toString('base64');
  
      // Save the updated profile background entity to the database
      await this.ProfileBgRepository.save(user.profile_image);
    } else {
      // Create new profile background entity
      const newProfileBg = new ProfileImage({
        name: image.originalname,
        content: image.buffer,
        ext: path.extname(image.originalname).toLowerCase().slice(1).trim(),
        base64: image.buffer.toString('base64'),
      });
  
      // Save the new profile background entity to the database
      user.profile_image = await this.ProfileBgRepository.save(newProfileBg);
    }
  
    // Save the updated user entity to the database
    return await this.userRepository.save(user);
  }

  // In your UserService

    async followUser(userId, targetUserId): Promise<void> {
      const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['following'] });
      const targetUser = await this.userRepository.findOne({ where: { id: targetUserId } });

      if (user && targetUser && !user.following.includes(targetUser)) {
        user.following.push(targetUser);
        await this.userRepository.save(user);
      }
    }

    async unfollowUser(userId: string, targetUserId: string): Promise<void> {
      // Find the user with the following relationship
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['following'],
      });
    
      // Find the target user
      const targetUser = await this.userRepository.findOne({
        where: { id: targetUserId },
      });
    
      if (!user || !targetUser) {
        console.log('User or Target User not found.');
        return;
      }
    
      console.log('Following List Before:', user.following);
    
      // Check if the target user is in the following list
      const isFollowing = user.following.some(followingUser => followingUser.id === targetUserId);
    
      if (!isFollowing) {
        console.log('Target user is not in the following list.');
        return;
      }
    
      // Remove the target user from the following list
      user.following = user.following.filter(followingUser => followingUser.id !== targetUserId);
    
      console.log('Following List After:', user.following);
    
      // Save the updated user with the modified following list
      await this.userRepository.save(user);
    
      console.log('Successfully unfollowed the user.');
    }
    
    async getFollowers(userId: string): Promise<User[]> {
      const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['followers'] });
      return user.followers;
    }

    async getFollowing(userId: string): Promise<User[]> {
      const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['following'] });
      return user.following;
    }

    async countFollowers(userId: string): Promise<number> {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['followers'],
      });
      
      // Return the number of followers
      return user.followers.length;
    }

    async countFollowing(userId: string): Promise<number> {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['following'],
      });
      
      // Return the number of people the user is following
      return user.following.length;
    }


    async createPostWithImage(
      createPostDto: CreatePostDto,
      userId: string,
      file?: Express.Multer.File,
    ): Promise<Post> {
      const { title, content, categoryName } = createPostDto;
  
      // Find or create the category
      let category = await this.categoryRepository.findOne({ where: { name: categoryName } });
      if (!category) {
        category = this.categoryRepository.create({ name: categoryName });
        await this.categoryRepository.save(category);
      }
  
      // Find the user  
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
  
      let savedPostImage: PostImage | null = null;
  
      // Handle image if provided
      if (file) {
        const ext = path.extname(file.originalname).toLowerCase();
        const base64Image = file.buffer.toString('base64');
  
        const postImage = this.postImageRepository.create({
          name: file.originalname,
          base64: base64Image,
          ext: ext.slice(1),
          content: file.buffer,
        });
  
        savedPostImage = await this.postImageRepository.save(postImage);
      }
  
      // Create the post
      const newPost = this.postRepository.create({
        title,
        content,
        category,
        user,
        post_image: savedPostImage ?? null, // Add image only if available
      });
  
      return await this.postRepository.save(newPost);
    }

  // Add a comment to a post
    async addComment(postId, userId, content: string): Promise<Comment> {
      // Ensure the post exists
      const post = await this.postRepository.findOne({ where: { id: postId } });
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // Ensure the user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Create the comment
      const comment = this.commentRepository.create({
        content,
        post: { id: postId }, // Associate the comment with the post
        user: { id: userId }  // Associate the comment with the user
      });

      // Save the comment to the database
      return await this.commentRepository.save(comment);
    }

  // Like a post
    async likePost(postId, userId): Promise<Like> {
      // Ensure the post exists
      const post = await this.postRepository.findOne({ where: { id: postId } });
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // Ensure the user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if the user has already liked the post
      const existingLike = await this.likeRepository.findOne({
        where: { post: { id: postId }, user: { id: userId } }
      });

      if (!existingLike) {
        // If no like exists, create a new one
        const like = this.likeRepository.create({
          post: { id: postId }, // Associate the like with the post
          user: { id: userId }  // Associate the like with the user
        });

        // Save the like to the database
        return await this.likeRepository.save(like);
      }

      // Return the existing like (user has already liked the post)
      return existingLike;
    }

    async getPostsFromFollowedUsers(userId: string): Promise<Post[]> {
      // Get the user with followed users, followed users' posts, and for each post, include comments and likes
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: [
          'following',               // Get the users the current user is following
          'following.posts',          // Get the posts of followed users
          'following.posts.user',     // Get the user who created each post
          'following.posts.comments', // Get the comments for each post
          'following.posts.likes',    // Get the likes for each post
        ],
      });
    
      // Get all posts from the followed users
      const followedUsers = user.following;
      const posts = followedUsers.flatMap(followedUser => followedUser.posts);
    
      return posts;
    }

  // async getAllPostsWithCategory(): Promise<Post[]> {
  //   return await this.postRepository.find({
  //     relations: ['category', 'post_image','user', 'comments','post_image','category'],
  //     select: {
  //       id: true,
  //       title: true,
  //       content: true,
  //       createdAt: true,
  //       category: { name: true },  // Select the category name
  //       post_image: { name: true, base64: true, ext: true},
  //       user: { id: true, full_name: true, email: true, password:true, country:true, state:true, role: true},
  //     },
  //   });
  // }

    async getAllPostsWithCategory(): Promise<Post[]> {
      return await this.postRepository.find({
        relations: ['category', 'post_image', 'user', 'comments', 'comments.user'], // Include user for comments
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          category: { id: true, name: true }, // Select category id and name
          post_image: { id: true, name: true, base64: true, ext: true }, // Select post image details
          user: { id: true, full_name: true, email: true }, // Avoid selecting sensitive fields like password
          comments: {
            id: true,
            content: true,
            createdAt: true,
            user: { id: true, full_name: true }, // Include user details for comments
          },
        },
      });
    }

    async getPostById(id: string): Promise<Post> {
      return await this.postRepository.findOne({
        where: { id }, // Find the post by its ID
        relations: ['category', 'post_image', 'user', 'comments', 'comments.user'], // Include relations
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          category: { id: true, name: true }, // Select category fields
          post_image: { id: true, name: true, base64: true, ext: true }, // Select post image details
          user: { id: true, full_name: true, email: true }, // Select non-sensitive user info
          comments: {
            id: true,
            content: true,
            createdAt: true,
            user: { id: true, full_name: true }, // Include user details for each comment
          },
        },
      });
    }

    async countPostsByUser(): Promise<any> {
      const result = await this.postRepository
        .createQueryBuilder('post')
        .select('post.userId', 'userId') // Select the user ID
        .addSelect('COUNT(post.id)', 'postCount') // Count the posts
        .groupBy('post.userId') // Group by user ID
        .getRawMany(); // Get raw results

      return result;
    }
    async countPostsByUserHimself(userId: string): Promise<any> {
      const postCountWithImages = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.post_image', 'post_image') // Join the post_image relation
        .where('post.userId = :userId', { userId })
        .select(['post.id', 'post.title', 'post_image.name', 'post_image.base64', 'post_image.ext'])
        .getCount(); // Get the count of posts by this user

      return postCountWithImages;
    }


    async countPostsWithLikesByUser(userId: string): Promise<any> {
      const postsWithLikesAndImages = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.likes', 'like') // Join the likes relation
        .leftJoinAndSelect('post.post_image', 'post_image') // Join the post_image relation
        .where('post.userId = :userId', { userId }) // Filter by userId
        .select([
          'post.id', 
          'post.title', 
          'post.content', 
          'COUNT(like.id) AS likeCount', 
          'post_image.name', 
          'post_image.base64', 
          'post_image.ext',
          'post.user'
        ]) // Select post details, image details, and count of likes
        .groupBy('post.id, post_image.id') // Group by post and post_image
        .getRawMany(); // Get the raw results

      return postsWithLikesAndImages;
    }

    async changeUserRole(userId, newRole: UserRole): Promise<User> {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!Object.values(UserRole).includes(newRole)) {
        throw new BadRequestException('Invalid role');
      }

      user.role = newRole;
      return await this.userRepository.save(user);
    }

    async deleteUser(id): Promise<void> {
      // Find the user by ID
      const user = await this.userRepository.findOne({
        where: { id },
      });

      // If the user is not found, throw an exception
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Delete the user by ID
      await this.userRepository.delete(id);

      console.log(`User with ID ${id} deleted successfully.`);
    }

    async deleteAllUsers(): Promise<void> {
      const users = await this.userRepository.find();
      await this.userRepository.remove(users);
      console.log('All users have been deleted.');
    }

}
