Lecture Notes: Perceptron, Exponential Families, GLMs, and Softmax Regression

Perceptron Algorithm

Overview and Historical Context

The perceptron algorithm is primarily studied for historical reasons and its simplicity. It is not widely used in practice today [00:01:42]. It represents a "hard" version of logistic regression's sigmoid function.

Hypothesis Function

The perceptron uses a step function as its activation:
```math
g(z) = \begin{cases}
1 & \text{if } z \ge 0 \\
0 & \text{if } z < 0
\end{cases}
```


This leads to the hypothesis:
h_\theta(x) = g(\theta^T x)


The output is a binary 0 or 1 based on whether$\theta^T x$ is positive or negative [00:04:18].

Update Rule

The perceptron update rule is applied online, example by example:
\theta_j := \theta_j + \alpha \, (y^{(i)} - h_\theta(x^{(i)})) \, x_j^{(i)}


where$\alpha$ is the learning rate [00:05:13].

Interpretation of the update:

· If the prediction is correct ($y^{(i)} = h_\theta(x^{(i)})$), the update term is zero.
· If the true label $y^{(i)}=1$ but the prediction is 0, the update term is $+1 \cdot x^{(i)}$.
· If the true label $y^{(i)}=0$ but the prediction is 1, the update term is $-1 \cdot x^{(i)}$ [00:06:41].

Geometric Intuition and Diagram Description

The parameter vector $\theta$ is normal to the decision boundary $\theta^T x = 0$. The goal is to have $\theta$ be similar (i.e., have a positive dot product) to $x$ when $y=1$, and dissimilar when $y=0$ [00:10:29].

Description of the update step:
Consider a misclassified positive example(a "box") that lies on the negative side of the decision boundary. The current $\theta$ vector points normal to the boundary. The update $\theta := \theta + \alpha x$ adds a component of the misclassified example $x$ to $\theta$. This rotates the new $\theta'$ vector slightly towards $x$, thereby adjusting the decision boundary to hopefully include $x$ in the positive class [00:08:47].

Limitations

The perceptron cannot learn non-linearly separable functions (e.g., XOR) [00:13:20]. It also lacks a probabilistic interpretation, unlike logistic regression [00:12:46]. Training can be stopped by annealing the learning rate until $\theta$ stops changing significantly [00:14:02].

---

Exponential Families

Definition

A probability distribution is a member of the exponential family if its probability density/mass function (PDF/PMF) can be written in the form:
p(y; \eta) = b(y) \, \exp\left( \eta^T T(y) - a(\eta) \right)


where:

· $y$ is the data (typically the output in a supervised setting) [00:16:00].
· $\eta$ is the natural parameter (vector) [00:17:03].
· $T(y)$ is the sufficient statistic. For most distributions in this course, $T(y) = y$ [00:17:16].
· $b(y)$ is the base measure (function of $y$ only) [00:17:38].
· $a(\eta)$ is the log-partition function (function of $\eta$ only). It acts as a normalizing constant to ensure the PDF integrates to 1 [00:17:52].

The log-partition function is defined by:
a(\eta) = \log \int b(y) \exp(\eta^T T(y)) \, dy

Example 1: Bernoulli Distribution

The Bernoulli distribution models binary data with parameter $\phi = P(y=1)$.
Its PMF is:
p(y; \phi) = \phi^y (1-\phi)^{1-y}


We can rewrite it in exponential family form[00:23:49]:
\begin{aligned}
p(y; \phi) &= \exp\left( y \log \phi + (1-y) \log (1-\phi) \right) \\
&= \exp\left( y \log\left(\frac{\phi}{1-\phi}\right) + \log(1-\phi) \right)
\end{aligned}

By pattern matching with the exponential family form:

· $b(y) = 1$
· $T(y) = y$
· $\eta = \log\left(\frac{\phi}{1-\phi}\right)$ (the log-odds)
· $a(\eta) = -\log(1-\phi) = \log(1 + e^\eta)$ [00:27:44].

The inverse relationship is the sigmoid function:
\phi = \frac{1}{1 + e^{-\eta}}

Example 2: Gaussian Distribution (with Fixed Variance)

For a Gaussian with mean $\mu$ and fixed variance $\sigma^2 = 1$:
p(y; \mu) = \frac{1}{\sqrt{2\pi}} \exp\left( -\frac{(y-\mu)^2}{2} \right)


Rewriting[00:30:15]:
p(y; \mu) = \frac{1}{\sqrt{2\pi}} \exp\left( -\frac{y^2}{2} \right) \exp\left( \mu y - \frac{\mu^2}{2} \right)

By pattern matching:

· $b(y) = \frac{1}{\sqrt{2\pi}} \exp(-y^2/2)$
· $T(y) = y$
· $\eta = \mu$
· $a(\eta) = \eta^2/2$

Note: If the variance is unknown, $\eta$ becomes a 2D vector [00:32:31].

Key Properties of Exponential Families

1. Convexity of MLE: Maximum likelihood estimation with respect to $\eta$ is a concave optimization problem. The negative log-likelihood (NLL) is convex [00:33:22].
2. Moments from Derivatives: The derivatives of the log-partition function yield the moments of the distribution:
   · Mean: $\mathbb{E}[Y; \eta] = \frac{d}{d\eta} a(\eta)$
   · Variance: $\text{Var}[Y; \eta] = \frac{d^2}{d\eta^2} a(\eta)$
     This property simplifies finding moments, as differentiation is easier than integration [00:34:25].

Common Distributions and Their Uses

· Real-valued data: Gaussian
· Binary data: Bernoulli
· Count data (non-negative integers): Poisson
· Positive real-valued data (e.g., time-to-event): Gamma or Exponential
· Distributions over probabilities (Bayesian): Beta, Dirichlet [00:38:38].

---

Generalized Linear Models (GLMs)

Core Assumptions / Design Choices

GLMs extend exponential families by incorporating input features $x$ [00:36:35]. The assumptions are:

1. Exponential Family Response: $y \mid x; \theta$ follows an exponential family distribution. The choice of distribution (e.g., Bernoulli, Gaussian) depends on the nature of the output data (e.g., classification, regression) [00:37:46].
2. Linear Model for Natural Parameter: The natural parameter $\eta$ is modeled as a linear combination of the inputs: $\eta = \theta^T x$ [00:40:56].
3. Mean as Output: At test time, the prediction for a new $x$ is the mean of the distribution: $h_\theta(x) = \mathbb{E}[y \mid x; \theta]$ [00:42:04].

Model Diagram Description

The GLM can be visualized as a two-stage process:

1. Model: A linear model takes input $x$ and learnable parameters $\theta$ to produce $\eta = \theta^T x$.
2. Distribution: The value $\eta$ serves as the natural parameter for an exponential family distribution (e.g., Bernoulli). The mean of this distribution, $\mu = g(\eta)$, is the final output prediction [00:43:47].
   During training,only $\theta$ is learned via maximum likelihood; the parameters of the distribution itself are not learned directly but are outputs of the model [00:45:46].

Unified Learning Update Rule

For any GLM, the stochastic gradient ascent update rule for maximum likelihood has the same form [00:48:20]:
\theta_j := \theta_j + \alpha \, (y^{(i)} - h_\theta(x^{(i)})) \, x_j^{(i)}


where$h_\theta(x) = \mathbb{E}[y \mid x; \theta]$ is the mean of the chosen exponential family distribution. This rule applies to linear regression, logistic regression, Poisson regression, etc., with the appropriate $h_\theta(x)$ [00:49:21].

Parameterization and Link Functions

Three parameter spaces are involved [00:53:56]:

1. Model Parameters ($\theta$): Learned via gradient descent.
2. Natural Parameters ($\eta$): $\eta = \theta^T x$.
3. Canonical Parameters ($\phi, \mu, \lambda, ...$): The original parameters of the distribution (e.g., $\phi$ for Bernoulli, $\mu$ for Gaussian).

The function $g$ that maps the natural parameter to the mean is the canonical response function:
\mu = \mathbb{E}[y; \eta] = g(\eta)


Its inverse,which maps the mean to the natural parameter, is the canonical link function:
\eta = g^{-1}(\mu)


A key property is that$g(\eta) = \frac{d}{d\eta} a(\eta)$ [00:52:12].

Example: Logistic Regression as a GLM

Choosing a Bernoulli distribution for $y \mid x$ leads to logistic regression [00:56:33].

· Natural parameter: $\eta = \theta^T x$.
· Canonical response: $\mu = \phi = \frac{1}{1 + e^{-\eta}}$ (the sigmoid function).
  Thus,the hypothesis $h_\theta(x) = \mathbb{E}[y \mid x; \theta] = \frac{1}{1 + e^{-\theta^T x}}$ emerges naturally from the GLM framework, rather than being chosen arbitrarily [00:57:43].

Data Generation Perspective (Diagram Descriptions)

For Regression (Gaussian GLM):

· Assume a true line $\theta^T x$ representing the mean $\mu$.
· For each input $x$, the corresponding $y$ is assumed to be generated from a Gaussian distribution centered at $\mu = \theta^T x$ (with fixed variance, e.g., 1).
· Observed data points $(x, y)$ are samples from these Gaussians at various $x$.
· Learning aims to find the line $\theta^T x$ such that the observed data points have the highest likelihood of being generated from the corresponding Gaussians [01:02:26].

For Classification (Bernoulli GLM):

· Assume a true line $\theta^T x$ representing the natural parameter $\eta$.
· The sigmoid function $g(\eta)$ maps $\eta$ to the probability $\phi$.
· For each $x$, the binary label $y$ is generated from a Bernoulli distribution with probability $\phi = g(\theta^T x)$.
· Observed data points $(x, y)$ are samples from these Bernoulli distributions.
· Learning aims to find the $\theta$ such that the sigmoid curve best explains the observed class labels (1s and 0s) [01:05:06].

---

Softmax Regression (Multi-class Classification)

Problem Setup

For $k$ classes, the label $y$ is represented as a one-hot vector in $\{0,1\}^k$, where a 1 indicates the correct class [01:10:45]. We learn a separate parameter vector $\theta^{(c)}$ for each class $c$, which can be stacked into a matrix $\Theta \in \mathbb{R}^{n \times k}$ [01:11:52].

Hypothesis Function: From Logits to Probabilities

For a given input $x$, we calculate a score or logit for each class: $\theta^{(c)T} x$ [01:15:39].

1. Exponentiate: Convert logits to positive numbers: $e^{\theta^{(c)T} x}$.
2. Normalize (Softmax): Divide by the sum over all classes to obtain a probability distribution:
   p(\text{class } c \mid x; \Theta) = \frac{e^{\theta^{(c)T} x}}{\sum_{j=1}^k e^{\theta^{(j)T} x}}
   
   This is thesoftmax function. The output $h_\Theta(x)$ is a vector of probabilities over the $k$ classes [01:17:03].

Cross-Entropy Loss

The true distribution $p(y)$ is the one-hot vector. The predicted distribution is $\hat{p}(y) = h_\Theta(x)$. We minimize the cross-entropy between them [01:19:55]:
\begin{aligned}
H(p, \hat{p}) &= -\sum_{c=1}^k p(y=c) \log \hat{p}(y=c) \\
&= -\log \hat{p}(y = \text{true class})
\end{aligned}


because$p(y)$ is zero for all but the true class. Substituting the softmax expression gives the loss for a single example:
\mathcal{L}(\Theta) = - \left[ \theta^{(y)T} x - \log \sum_{j=1}^k e^{\theta^{(j)T} x} \right]


where$y$ is the index of the true class [01:20:46]. Gradient descent is performed on $\mathcal{L}(\Theta)$ with respect to all parameters $\Theta$.

Note: This derivation uses a cross-entropy minimization perspective. Softmax regression can also be derived as a GLM using a Multinomial distribution [01:08:43].