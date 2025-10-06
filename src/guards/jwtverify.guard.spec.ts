import { JwtverifyGuard } from './jwtverify.guard';

describe('JwtverifyGuard', () => {
  it('should be defined', () => {
    expect(new JwtverifyGuard()).toBeDefined();
  });
});
